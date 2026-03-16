import React, { useState, useCallback, useEffect } from 'react';
import { Settings, Wifi, WifiOff } from 'lucide-react';

import { StatusBar } from './components/StatusBar';
import { CameraFeed } from './components/CameraFeed';
import { VoiceButton } from './components/VoiceButton';
import { TranscriptOverlay } from './components/TranscriptOverlay';
import { EscalationAlert } from './components/EscalationAlert';

import { useWebSocket } from './hooks/useWebSocket';
import { useAudioStream } from './hooks/useAudioStream';
import { useCameraCapture } from './hooks/useCameraCapture';

import type {
  AgentStatus,
  TranscriptEntry,
  EquipmentInfo,
  EscalationEvent,
  WsOutboundMessage,
  WsInboundMessage,
} from './types';

// ─── Config ──────────────────────────────────────────────────────────────────

const WS_URL =
  process.env.REACT_APP_BACKEND_URL ||
  'ws://localhost:8000/ws'; // Override with ngrok URL or Cloud Run

// ─── FieldMindApp ─────────────────────────────────────────────────────────────

export default function FieldMindApp() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [equipment, setEquipment] = useState<EquipmentInfo | null>(null);
  const [escalation, setEscalation] = useState<EscalationEvent | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [backendUrl, setBackendUrl] = useState(WS_URL);

  const wsHook = useWebSocket();
  const { status: connStatus, send, lastMessage, sessionId, connect, disconnect } = wsHook;

  // ── Handle incoming WS messages ───────────────────────────────────────────
  useEffect(() => {
    if (!lastMessage) return;
    handleInboundMessage(lastMessage);
  }, [lastMessage]); // eslint-disable-line

  const handleInboundMessage = useCallback((msg: WsInboundMessage) => {
    switch (msg.type) {
      case 'transcript': {
        const data = msg.data as { text: string; is_final: boolean; speaker: 'technician' | 'fieldmind' };
        const entry: TranscriptEntry = {
          id: `${msg.timestamp}-${Math.random()}`,
          speaker: data.speaker,
          text: data.text,
          timestamp: msg.timestamp,
          isFinal: data.is_final,
        };
        setTranscript((prev) => {
          // Update existing partial entry or append
          if (!data.is_final && prev.length > 0 && !prev[prev.length - 1].isFinal) {
            const updated = [...prev];
            updated[updated.length - 1] = entry;
            return updated;
          }
          return [...prev, entry];
        });
        break;
      }

      case 'agent_response': {
        const data = msg.data as { text: string; is_final: boolean };
        const entry: TranscriptEntry = {
          id: `fm-${msg.timestamp}-${Math.random()}`,
          speaker: 'fieldmind',
          text: data.text,
          timestamp: msg.timestamp,
          isFinal: data.is_final,
        };
        setTranscript((prev) => [...prev, entry]);
        setAgentStatus('speaking');
        break;
      }

      case 'equipment_identified': {
        const eq = msg.data as EquipmentInfo;
        setEquipment(eq);
        setAgentStatus('analyzing');
        setTimeout(() => setAgentStatus('idle'), 2000);
        break;
      }

      case 'escalation_triggered': {
        const esc = msg.data as EscalationEvent;
        setEscalation(esc);
        setAgentStatus('escalating');
        break;
      }

      case 'status_update': {
        const data = msg.data as { agent_status: AgentStatus };
        setAgentStatus(data.agent_status);
        break;
      }

      case 'error': {
        const data = msg.data as { message: string };
        console.error('[FieldMind] Backend error:', data.message);
        break;
      }

      default:
        break;
    }
  }, []);

  // ── Audio chunk → WebSocket ───────────────────────────────────────────────
  const handleAudioChunk = useCallback(
    (chunk: string) => {
      const msg: WsOutboundMessage = {
        type: 'audio_chunk',
        session_id: sessionId,
        timestamp: Date.now(),
        payload: chunk,
      };
      send(msg);
    },
    [send, sessionId]
  );

  // ── Camera frame → WebSocket ──────────────────────────────────────────────
  const handleCameraFrame = useCallback(
    (frameBase64: string) => {
      const msg: WsOutboundMessage = {
        type: 'camera_frame',
        session_id: sessionId,
        timestamp: Date.now(),
        payload: frameBase64,
        metadata: { width: 640, height: 480, format: 'jpeg' },
      };
      send(msg);
    },
    [send, sessionId]
  );

  const audioHook = useAudioStream(handleAudioChunk);
  const cameraHook = useCameraCapture(handleCameraFrame);

  const { isRecording, startRecording, stopRecording, audioLevel } = audioHook;
  const { videoRef, isActive: cameraActive, startCamera, error: cameraError } = cameraHook;

  // ── Connect on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    connect(backendUrl);
    return () => disconnect();
  }, []); // eslint-disable-line

  // ── Voice button handlers ─────────────────────────────────────────────────
  const handleVoiceStart = useCallback(async () => {
    setAgentStatus('listening');
    await startRecording();
  }, [startRecording]);

  const handleVoiceStop = useCallback(() => {
    stopRecording();
    setAgentStatus('idle');
  }, [stopRecording]);

  // ── Auto-start camera on first connect ───────────────────────────────────
  useEffect(() => {
    if (connStatus === 'connected' && !cameraActive && !cameraError) {
      startCamera();
    }
  }, [connStatus]); // eslint-disable-line

  const isConnected = connStatus === 'connected';

  return (
    <div
      className="
        min-h-screen w-full max-w-md mx-auto
        bg-field-bg text-field-text
        flex flex-col
        font-body
        overflow-hidden
      "
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* ── Status bar ─────────────────────────────────────────────────── */}
      <StatusBar
        connectionStatus={connStatus}
        agentStatus={agentStatus}
        sessionId={sessionId}
      />

      {/* ── Camera feed ────────────────────────────────────────────────── */}
      <div className="flex-none">
        <CameraFeed
          videoRef={videoRef}
          isActive={cameraActive}
          isAnalyzing={agentStatus === 'analyzing'}
          equipment={equipment}
          error={cameraError}
          onStart={startCamera}
        />
      </div>

      {/* ── Transcript ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-field-panel border-y border-field-border">
        <TranscriptOverlay entries={transcript} maxVisible={4} />
      </div>

      {/* ── Controls ───────────────────────────────────────────────────── */}
      <div className="flex-none bg-field-surface border-t border-field-border">
        <div className="flex flex-col items-center py-6 gap-2">
          {!isConnected && (
            <div className="mb-2 px-4 py-2 bg-field-panel border border-field-border rounded-sm">
              <span className="font-mono text-[10px] tracking-widest text-field-text-dim uppercase">
                {connStatus === 'connecting' || connStatus === 'reconnecting'
                  ? '⏳ Connecting to backend...'
                  : '⚠ Backend offline — check ngrok URL'}
              </span>
            </div>
          )}

          <VoiceButton
            isRecording={isRecording}
            agentStatus={agentStatus}
            audioLevel={audioLevel}
            onStart={handleVoiceStart}
            onStop={handleVoiceStop}
            disabled={!isConnected}
          />
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between px-5 pb-4 pb-safe">
          <button
            className="text-field-text-dim hover:text-field-amber transition-colors p-1"
            onClick={() => setShowSettings((v) => !v)}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="font-mono text-[9px] tracking-widest text-field-text-dim uppercase">
            {cameraActive ? `📷 1fps` : '📷 off'} · {isRecording ? '🎙 live' : '🎙 muted'}
          </div>

          <div className="text-field-text-dim p-1" aria-hidden>
            {isConnected
              ? <Wifi className="w-5 h-5 text-field-green" />
              : <WifiOff className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* ── Settings drawer ─────────────────────────────────────────────── */}
      {showSettings && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowSettings(false)}
          />
          <div className="relative z-10 bg-field-surface border-t border-field-border p-5 space-y-4">
            <h2 className="font-mono text-xs tracking-widest uppercase text-field-amber font-bold">
              Connection Settings
            </h2>
            <div className="space-y-1">
              <label className="font-mono text-[9px] tracking-widest text-field-text-dim uppercase block">
                Backend WebSocket URL
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="
                  w-full bg-field-panel border border-field-border
                  font-mono text-xs text-field-text
                  px-3 py-2 rounded-sm
                  focus:outline-none focus:border-field-amber
                "
                placeholder="wss://xxxx.ngrok.io/ws"
              />
            </div>
            <button
              className="
                w-full py-2.5 bg-field-amber text-field-bg
                font-mono text-xs font-bold tracking-widest uppercase
                rounded-sm hover:bg-field-amber/90 transition-colors
              "
              onClick={() => {
                disconnect();
                setTimeout(() => connect(backendUrl), 300);
                setShowSettings(false);
              }}
            >
              RECONNECT
            </button>
            <div className="font-mono text-[9px] text-field-text-dim tracking-wider">
              Session: {sessionId}
            </div>
          </div>
        </div>
      )}

      {/* ── Escalation alert ─────────────────────────────────────────────── */}
      <EscalationAlert
        event={escalation}
        onDismiss={() => {
          setEscalation(null);
          setAgentStatus('idle');
        }}
      />
    </div>
  );
}
