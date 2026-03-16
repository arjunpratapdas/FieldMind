import React from 'react';
import { AlertTriangle, X, PhoneCall, CheckCircle2, Clock } from 'lucide-react';
import type { EscalationEvent } from '../types';

interface EscalationAlertProps {
  event: EscalationEvent | null;
  onDismiss: () => void;
}

const PRIORITY_CONFIG = {
  low:      { label: 'LOW',      color: 'text-field-green',  borderColor: 'border-field-green', bgColor: 'bg-field-green/10'  },
  medium:   { label: 'MEDIUM',   color: 'text-field-amber',  borderColor: 'border-field-amber', bgColor: 'bg-field-amber/10'  },
  high:     { label: 'HIGH',     color: 'text-orange-400',   borderColor: 'border-orange-400', bgColor: 'bg-orange-400/10'   },
  critical: { label: 'CRITICAL', color: 'text-field-red',    borderColor: 'border-field-red', bgColor: 'bg-field-red/10'    },
};

export const EscalationAlert: React.FC<EscalationAlertProps> = ({
  event,
  onDismiss,
}) => {
  if (!event) return null;

  const priority = PRIORITY_CONFIG[event.priority];
  const time = new Date(event.timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-label="Escalation alert"
    >
      {/* Enhanced backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Alert panel with enhanced styling */}
      <div
        className={`
          relative w-full max-w-md
          glass border-2 ${priority.borderColor}
          rounded-2xl p-6
          shadow-[0_0_60px_rgba(255,59,48,0.4)]
          animate-slide-up
        `}
      >
        {/* Animated glow effect */}
        <div className={`absolute inset-0 ${priority.bgColor} rounded-2xl blur-xl opacity-50`} />
        
        {/* Header with enhanced icon */}
        <div className="relative flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${priority.bgColor} rounded-full`}>
              <AlertTriangle className={`w-6 h-6 ${priority.color} animate-pulse`} strokeWidth={2.5} />
            </div>
            <div>
              <span className={`font-mono text-sm font-black tracking-[0.25em] uppercase ${priority.color}`}>
                CASE ESCALATED
              </span>
              <div className="font-mono text-[9px] text-field-text-dim tracking-wider uppercase mt-0.5">
                DISPATCH NOTIFIED
              </div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-field-text-dim hover:text-field-text transition-colors p-1 hover:bg-field-panel rounded-lg"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case info with enhanced layout */}
        <div className="relative space-y-3 mb-5">
          <div className="flex items-center justify-between p-3 glass rounded-lg border border-field-border/50">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-[0.25em] text-field-text-dim uppercase">
                CASE ID
              </span>
            </div>
            <span className="font-mono text-sm text-field-text font-black tracking-wider">
              #{event.caseId.slice(0, 12).toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 glass rounded-lg border border-field-border/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-field-text-dim" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-field-text-dim uppercase">
                PRIORITY
              </span>
            </div>
            <span className={`font-mono text-sm font-black px-3 py-1 rounded-full ${priority.bgColor} ${priority.color} border ${priority.borderColor}`}>
              {priority.label}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 glass rounded-lg border border-field-border/50">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-field-text-dim" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-field-text-dim uppercase">
                TIME
              </span>
            </div>
            <span className="font-mono text-sm text-field-text font-medium">
              {time}
            </span>
          </div>
        </div>

        {/* Reason with enhanced styling */}
        <div className="relative glass border border-field-border/50 rounded-xl p-4 mb-5">
          <div className="font-mono text-[9px] tracking-[0.25em] text-field-text-dim uppercase mb-2">
            DIAGNOSTIC SUMMARY
          </div>
          <p className="font-body text-sm text-field-text leading-relaxed">{event.reason}</p>
        </div>

        {/* Action confirmation with animation */}
        <div className="relative flex items-center gap-3 p-4 bg-field-green/10 border border-field-green/30 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-field-green animate-pulse" strokeWidth={2.5} />
          <div className="flex-1">
            <div className="font-mono text-xs tracking-[0.2em] text-field-green uppercase font-bold">
              DISPATCH TEAM NOTIFIED
            </div>
            <div className="font-mono text-[9px] text-field-text-dim tracking-wider mt-0.5">
              Case logged • Specialist en route
            </div>
          </div>
          <PhoneCall className="w-5 h-5 text-field-green animate-pulse" />
        </div>
      </div>
    </div>
  );
};
