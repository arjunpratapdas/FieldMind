import React, { useEffect, useRef } from 'react';
import { MessageSquare, Bot, User } from 'lucide-react';
import type { TranscriptEntry } from '../types';

interface TranscriptOverlayProps {
  entries: TranscriptEntry[];
  maxVisible?: number;
}

export const TranscriptOverlay: React.FC<TranscriptOverlayProps> = ({
  entries,
  maxVisible = 4,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const visible = entries.slice(-maxVisible);

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-field-text-dim">
        <MessageSquare className="w-8 h-8 mb-3 opacity-30" />
        <span className="font-mono text-xs tracking-[0.3em] uppercase">
          — AWAITING TRANSMISSION —
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-3 px-4 py-4 overflow-hidden"
      role="log"
      aria-live="polite"
      aria-label="Conversation transcript"
    >
      {visible.map((entry, idx) => {
        const age = visible.length - 1 - idx;
        const opacity = age === 0 ? 1 : age === 1 ? 0.7 : 0.4;
        const isFieldMind = entry.speaker === 'fieldmind';

        return (
          <div
            key={entry.id}
            className="flex flex-col gap-1.5 transition-all duration-500 animate-slide-up"
            style={{ opacity }}
          >
            {/* Speaker label with icon */}
            <div className="flex items-center gap-2">
              {isFieldMind ? (
                <Bot className="w-3.5 h-3.5 text-field-amber" strokeWidth={2.5} />
              ) : (
                <User className="w-3.5 h-3.5 text-blue-400" strokeWidth={2.5} />
              )}
              <span
                className={`
                  font-mono text-[9px] tracking-[0.25em] font-black uppercase
                  ${isFieldMind ? 'text-field-amber' : 'text-blue-400'}
                `}
              >
                {isFieldMind ? 'FIELDMIND' : 'TECHNICIAN'}
              </span>
              <span className="text-field-border text-xs">•</span>
              <span className="font-mono text-[8px] text-field-text-dim tracking-wider">
                {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>

            {/* Message text with enhanced styling */}
            <div
              className={`
                font-body text-sm leading-relaxed
                px-4 py-3 rounded-lg
                ${isFieldMind 
                  ? 'bg-field-amber/10 border-l-4 border-field-amber text-field-amber' 
                  : 'bg-blue-500/10 border-l-4 border-blue-400 text-blue-200'}
                ${!entry.isFinal ? 'italic opacity-70' : ''}
              `}
            >
              {entry.text}
              {!entry.isFinal && (
                <span className="ml-2 inline-block w-1.5 h-4 bg-current align-middle animate-blink" />
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
