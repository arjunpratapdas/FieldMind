// ─── Connection States ───────────────────────────────────────────────────────

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

// ─── Agent States ─────────────────────────────────────────────────────────────

export type AgentStatus =
  | 'idle'
  | 'listening'
  | 'analyzing'
  | 'speaking'
  | 'escalating';

// ─── WebSocket Messages ───────────────────────────────────────────────────────

export type WsMessageType =
  | 'audio_chunk'
  | 'camera_frame'
  | 'session_start'
  | 'session_end'
  | 'ping';

export interface WsOutboundMessage {
  type: WsMessageType;
  session_id: string;
  timestamp: number;
  payload: string; // base64 encoded
  metadata?: Record<string, unknown>;
}

export type WsInboundType =
  | 'transcript'
  | 'agent_response'
  | 'equipment_identified'
  | 'escalation_triggered'
  | 'status_update'
  | 'error'
  | 'pong';

export interface WsInboundMessage {
  type: WsInboundType;
  session_id: string;
  timestamp: number;
  data: unknown;
}

export interface TranscriptEntry {
  id: string;
  speaker: 'technician' | 'fieldmind';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

// ─── Equipment ────────────────────────────────────────────────────────────────

export interface EquipmentInfo {
  make: string;
  model: string;
  serial?: string;
  lastServiceDate?: string;
  faultCodes?: string[];
  confidence: number;
}

// ─── Escalation ───────────────────────────────────────────────────────────────

export interface EscalationEvent {
  caseId: string;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

// ─── Hook Return Types ────────────────────────────────────────────────────────

export interface UseWebSocketReturn {
  status: ConnectionStatus;
  send: (message: WsOutboundMessage) => void;
  lastMessage: WsInboundMessage | null;
  sessionId: string;
  connect: (url: string) => void;
  disconnect: () => void;
}

export interface UseAudioStreamReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioLevel: number; // 0-1 for waveform visualization
  error: string | null;
}

export interface UseCameraCaptureReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  lastFrame: string | null; // base64 JPEG
  error: string | null;
}
