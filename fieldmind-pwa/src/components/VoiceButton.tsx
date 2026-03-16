import React, { useCallback, useRef } from 'react';
import { Mic, MicOff, Loader, Radio } from 'lucide-react';
import type { AgentStatus } from '../types';

interface VoiceButtonProps {
  isRecording: boolean;
  agentStatus: AgentStatus;
  audioLevel: number; // 0-1
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isRecording,
  agentStatus,
  audioLevel,
  onStart,
  onStop,
  disabled = false,
}) => {
  const isHoldingRef = useRef(false);

  const handlePressStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (disabled || isHoldingRef.current) return;
      isHoldingRef.current = true;
      onStart();
    },
    [disabled, onStart]
  );

  const handlePressEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isHoldingRef.current) return;
      isHoldingRef.current = false;
      onStop();
    },
    [onStop]
  );

  const ringScale = 1 + audioLevel * 0.4;
  const ringOpacity = isRecording ? 0.4 + audioLevel * 0.6 : 0;

  const isBusy = agentStatus === 'speaking' || agentStatus === 'analyzing';
  const isEscalating = agentStatus === 'escalating';

  const buttonColor = isEscalating
    ? 'bg-gradient-to-br from-field-red to-red-700 border-field-red shadow-[0_0_30px_rgba(255,59,48,0.5)]'
    : isRecording
    ? 'bg-gradient-to-br from-field-amber to-field-gold border-field-amber shadow-[0_0_40px_rgba(249,168,37,0.6)] animate-glow-pulse'
    : isBusy
    ? 'glass border-field-cyan shadow-[0_0_20px_rgba(0,188,212,0.3)]'
    : 'glass border-field-border hover:border-field-amber hover:shadow-[0_0_20px_rgba(249,168,37,0.3)]';

  const iconColor = isEscalating
    ? 'text-white'
    : isRecording
    ? 'text-field-bg'
    : isBusy
    ? 'text-field-cyan'
    : 'text-field-amber';

  return (
    <div className="relative flex flex-col items-center gap-4 select-none">
      {/* Multiple audio level rings */}
      {isRecording && (
        <>
          <div
            className="absolute inset-0 rounded-full border-[3px] border-field-amber transition-all duration-75"
            style={{
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
              pointerEvents: 'none',
              boxShadow: '0 0 20px rgba(249, 168, 37, 0.5)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-field-gold animate-ping"
            style={{ opacity: 0.3 }}
          />
          <div
            className="absolute inset-0 rounded-full border border-field-amber animate-pulse"
            style={{ opacity: 0.2, transform: 'scale(1.2)' }}
          />
        </>
      )}

      {/* Main button with enhanced styling */}
      <button
        className={`
          relative z-10
          w-28 h-28 rounded-full
          border-[3px] ${buttonColor}
          flex items-center justify-center
          transition-all duration-200
          active:scale-95
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${isRecording ? 'scale-110' : 'scale-100'}
        `}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        disabled={disabled}
        aria-label={isRecording ? 'Release to send' : 'Hold to talk'}
        aria-pressed={isRecording}
      >
        {/* Inner glow effect */}
        {isRecording && (
          <div className="absolute inset-2 rounded-full bg-field-amber/20 blur-xl" />
        )}
        
        {isBusy && !isRecording ? (
          <Loader className={`w-10 h-10 ${iconColor} animate-spin`} strokeWidth={2.5} />
        ) : isRecording ? (
          <div className="relative">
            <Mic className={`w-10 h-10 ${iconColor}`} strokeWidth={2.5} />
            <Radio className="absolute -top-1 -right-1 w-4 h-4 text-field-bg animate-pulse" />
          </div>
        ) : disabled ? (
          <MicOff className={`w-10 h-10 ${iconColor}`} strokeWidth={2.5} />
        ) : (
          <Mic className={`w-10 h-10 ${iconColor}`} strokeWidth={2.5} />
        )}
      </button>

      {/* Enhanced label with background */}
      <div className="flex flex-col items-center gap-1">
        <span
          className={`
            font-mono text-xs tracking-[0.3em] font-black uppercase
            px-4 py-1.5 rounded-full
            ${isRecording
              ? 'text-field-amber bg-field-amber/10 border border-field-amber/30'
              : isBusy
              ? 'text-field-cyan bg-field-cyan/10 border border-field-cyan/30'
              : 'text-field-text-dim'}
          `}
        >
          {isRecording
            ? '◉ RELEASE TO SEND'
            : isBusy
            ? agentStatus === 'speaking'
              ? '◉ SPEAKING...'
              : '◎ ANALYZING...'
            : isEscalating
            ? '⚠ ESCALATING'
            : '◈ HOLD TO TALK'}
        </span>
        
        {!isRecording && !isBusy && !disabled && (
          <span className="font-mono text-[9px] text-field-text-dim tracking-widest uppercase">
            VOICE INTERFACE
          </span>
        )}
      </div>

      {/* Enhanced waveform bars */}
      {isRecording && (
        <div className="flex items-end gap-1 h-8 px-4 py-2 glass rounded-lg border border-field-amber/30" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => {
            const height =
              Math.abs(Math.sin((Date.now() / 150 + i) * 0.9)) * audioLevel * 100;
            return (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-field-amber to-field-gold rounded-full transition-all duration-75 shadow-[0_0_5px_rgba(249,168,37,0.5)]"
                style={{ height: `${Math.max(8, height)}%`, minHeight: '8px' }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
