import React from 'react';
import { Activity, Zap } from 'lucide-react';
import type { ConnectionStatus, AgentStatus } from '../types';

interface StatusBarProps {
  connectionStatus: ConnectionStatus;
  agentStatus: AgentStatus;
  sessionId: string;
}

const CONNECTION_CONFIG: Record<
  ConnectionStatus,
  { label: string; color: string; dotClass: string }
> = {
  disconnected: {
    label: 'OFFLINE',
    color: 'text-field-text-dim',
    dotClass: 'bg-field-muted',
  },
  connecting: {
    label: 'CONNECTING',
    color: 'text-yellow-500',
    dotClass: 'bg-yellow-500 animate-pulse',
  },
  reconnecting: {
    label: 'RECONNECTING',
    color: 'text-yellow-500',
    dotClass: 'bg-yellow-500 animate-pulse',
  },
  connected: {
    label: 'LIVE',
    color: 'text-field-green',
    dotClass: 'bg-field-green animate-pulse-ring',
  },
  error: {
    label: 'ERROR',
    color: 'text-field-red',
    dotClass: 'bg-field-red animate-pulse',
  },
};

const AGENT_CONFIG: Record<
  AgentStatus,
  { label: string; color: string; icon: string }
> = {
  idle:       { label: 'STANDBY',   color: 'text-field-text-dim', icon: '◈' },
  listening:  { label: 'LISTENING', color: 'text-field-amber', icon: '◉' },
  analyzing:  { label: 'ANALYZING', color: 'text-field-cyan', icon: '◎' },
  speaking:   { label: 'SPEAKING',  color: 'text-field-green', icon: '◉' },
  escalating: { label: 'ESCALATING', color: 'text-field-red', icon: '⚠' },
};

export const StatusBar: React.FC<StatusBarProps> = ({
  connectionStatus,
  agentStatus,
  sessionId,
}) => {
  const conn = CONNECTION_CONFIG[connectionStatus];
  const agent = AGENT_CONFIG[agentStatus];
  const shortId = sessionId.slice(0, 8).toUpperCase();

  return (
    <div
      className="
        relative
        flex items-center justify-between
        px-4 py-3
        glass border-b border-field-border
        font-mono text-xs tracking-widest
        select-none
      "
      role="status"
      aria-live="polite"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-field-amber/5 via-transparent to-field-cyan/5 opacity-50" />
      
      {/* Left: Brand with icon */}
      <div className="relative flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-field-amber" strokeWidth={2.5} />
          <span className="font-display text-base font-black tracking-[0.15em] gradient-text uppercase">
            FIELDMIND
          </span>
        </div>
        <span className="text-field-border text-lg">│</span>
        <span className="text-field-text-dim text-[9px] tracking-[0.2em] font-medium">
          #{shortId}
        </span>
      </div>

      {/* Center: Agent state with icon */}
      <div
        className={`
          relative flex items-center gap-2
          px-3 py-1 rounded-full
          bg-field-panel/50 border border-field-border/50
          text-[9px] tracking-[0.25em] font-bold
          ${agent.color}
        `}
      >
        <span className="text-sm">{agent.icon}</span>
        {agent.label}
        {agentStatus !== 'idle' && (
          <Activity className="w-3 h-3 animate-pulse" />
        )}
      </div>

      {/* Right: Connection with enhanced indicator */}
      <div className={`relative flex items-center gap-2 text-[9px] tracking-[0.2em] font-bold ${conn.color}`}>
        <div className="relative">
          <span className={`inline-block w-2 h-2 rounded-full ${conn.dotClass}`} />
          {connectionStatus === 'connected' && (
            <span className="absolute inset-0 w-2 h-2 rounded-full bg-field-green animate-ping opacity-75" />
          )}
        </div>
        {conn.label}
      </div>
    </div>
  );
};
