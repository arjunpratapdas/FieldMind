import { useState, useRef, useCallback, useEffect } from 'react';
import type { UseCameraCaptureReturn } from '../types';

const CAPTURE_INTERVAL_MS = 1000; // 1 fps as specified
const JPEG_QUALITY = 0.7;         // Balances size vs quality
const CAPTURE_WIDTH = 640;
const CAPTURE_HEIGHT = 480;

type FrameCallback = (frameBase64: string) => void;

/**
 * useCameraCapture
 * Opens the rear camera (environment-facing), renders to a <video> element,
 * and captures 1fps JPEG frames as base64 strings via callback.
 *
 * Returns a videoRef to attach to a <video> element in the UI.
 */
export function useCameraCapture(
  onFrame: FrameCallback
): UseCameraCaptureReturn {
  const [isActive, setIsActive] = useState(false);
  const [lastFrame, setLastFrame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onFrameRef = useRef<FrameCallback>(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  // ── Capture a single frame ────────────────────────────────────────────────
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    if (!video.videoWidth || !video.videoHeight) return;

    // Lazy-create canvas
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    canvas.width = CAPTURE_WIDTH;
    canvas.height = CAPTURE_HEIGHT;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw and crop to 640×480
    const { videoWidth: vw, videoHeight: vh } = video;
    const scale = Math.max(CAPTURE_WIDTH / vw, CAPTURE_HEIGHT / vh);
    const sw = CAPTURE_WIDTH / scale;
    const sh = CAPTURE_HEIGHT / scale;
    const sx = (vw - sw) / 2;
    const sy = (vh - sh) / 2;

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    const base64 = dataUrl.split(',')[1]; // strip data:image/jpeg;base64,

    setLastFrame(dataUrl);
    onFrameRef.current(base64);
  }, []);

  // ── Start camera ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setError(null);
    try {
      // Prefer rear camera on mobile (environment)
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // iOS
        await videoRef.current.play();
      }

      // Wait a tick for video metadata to load
      await new Promise<void>((resolve) => {
        if (!videoRef.current) { resolve(); return; }
        if (videoRef.current.readyState >= HTMLMediaElement.HAVE_METADATA) {
          resolve();
        } else {
          videoRef.current.onloadedmetadata = () => resolve();
        }
      });

      captureTimerRef.current = setInterval(captureFrame, CAPTURE_INTERVAL_MS);
      setIsActive(true);
      console.log('[FieldMind Camera] Started — capturing at 1fps');
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera access denied. Grant permission in browser settings.'
          : err instanceof Error
          ? err.message
          : 'Camera unavailable';
      console.error('[FieldMind Camera] Error:', err);
      setError(msg);
    }
  }, [captureFrame]);

  // ── Stop camera ───────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (captureTimerRef.current) {
      clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    setLastFrame(null);
    console.log('[FieldMind Camera] Stopped');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { videoRef, isActive, startCamera, stopCamera, lastFrame, error };
}
