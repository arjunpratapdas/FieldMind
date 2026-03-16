import { useState, useRef, useCallback, useEffect } from 'react';
import type { UseAudioStreamReturn } from '../types';

const SAMPLE_RATE = 16000;        // Gemini Live requires 16kHz
const CHUNK_INTERVAL_MS = 100;    // Send audio every 100ms
const BUFFER_SIZE = 4096;

type AudioChunkCallback = (chunk: string) => void; // base64 PCM Int16

/**
 * useAudioStream
 * Captures microphone audio, converts to PCM Int16 at 16kHz,
 * and delivers 100ms base64-encoded chunks via callback.
 * Tracks audio level (0-1) for waveform visualization.
 *
 * iOS AudioContext: must be unlocked by a user gesture before calling startRecording().
 * This hook handles the AudioContext.resume() call automatically on start.
 */
export function useAudioStream(
  onChunk: AudioChunkCallback
): UseAudioStreamReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pcmBufferRef = useRef<number[]>([]);
  const chunkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const levelAnimRef = useRef<number | null>(null);
  const onChunkRef = useRef<AudioChunkCallback>(onChunk);

  // Keep callback ref current to avoid stale closure
  useEffect(() => {
    onChunkRef.current = onChunk;
  }, [onChunk]);

  // ── Level meter via requestAnimationFrame ─────────────────────────────────
  const startLevelMeter = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const rms = Math.sqrt(
        dataArray.reduce((sum, v) => sum + v * v, 0) / dataArray.length
      );
      setAudioLevel(Math.min(rms / 128, 1));
      levelAnimRef.current = requestAnimationFrame(tick);
    };
    levelAnimRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLevelMeter = useCallback(() => {
    if (levelAnimRef.current) {
      cancelAnimationFrame(levelAnimRef.current);
      levelAnimRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // ── Flush PCM buffer → base64 chunk ──────────────────────────────────────
  const flushBuffer = useCallback(() => {
    if (pcmBufferRef.current.length === 0) return;
    const samples = pcmBufferRef.current.splice(0, pcmBufferRef.current.length);

    // Convert float32 → Int16 PCM
    const int16Array = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      const clamped = Math.max(-1, Math.min(1, samples[i]));
      int16Array[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    }

    // Encode to base64
    const uint8 = new Uint8Array(int16Array.buffer);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const base64 = btoa(binary);
    onChunkRef.current(base64);
  }, []);

  // ── Start recording ───────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setError(null);
    try {
      // Request mic with optimal settings for speech
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Create/resume AudioContext (required for iOS)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)({ sampleRate: SAMPLE_RATE });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const source = ctx.createMediaStreamSource(stream);

      // Analyser for level meter
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      // ScriptProcessor for PCM capture
      // Note: ScriptProcessorNode is deprecated but AudioWorklet requires
      // bundling a separate worker file — ScriptProcessor is fine for hackathon.
      const processor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);
      processorRef.current = processor;
      source.connect(processor);
      processor.connect(ctx.destination);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        pcmBufferRef.current.push(...Array.from(inputData));
      };

      // Flush buffer on interval
      chunkTimerRef.current = setInterval(flushBuffer, CHUNK_INTERVAL_MS);

      startLevelMeter();
      setIsRecording(true);
      console.log('[FieldMind Audio] Recording started — sampleRate:', ctx.sampleRate);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Microphone access denied';
      console.error('[FieldMind Audio] Error:', err);
      setError(msg);
    }
  }, [flushBuffer, startLevelMeter]);

  // ── Stop recording ────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (chunkTimerRef.current) {
      clearInterval(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }

    // Flush remaining buffer
    flushBuffer();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    stopLevelMeter();
    pcmBufferRef.current = [];
    setIsRecording(false);
    console.log('[FieldMind Audio] Recording stopped');
  }, [flushBuffer, stopLevelMeter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      audioContextRef.current?.close();
    };
  }, [stopRecording]);

  return { isRecording, startRecording, stopRecording, audioLevel, error };
}
