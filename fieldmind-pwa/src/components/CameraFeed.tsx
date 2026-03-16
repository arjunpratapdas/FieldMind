import React from 'react';
import { Camera, CameraOff, Scan, Target } from 'lucide-react';
import type { EquipmentInfo } from '../types';

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  isAnalyzing: boolean;
  equipment: EquipmentInfo | null;
  error: string | null;
  onStart: () => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  videoRef,
  isActive,
  isAnalyzing,
  equipment,
  error,
  onStart,
}) => {
  return (
    <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-2xl border border-field-border/30">

      {/* Video element */}
      <video
        ref={videoRef}
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-opacity duration-300
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}
        autoPlay
        playsInline
        muted
        aria-label="Camera feed"
      />

      {/* Enhanced corner brackets with glow */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top-left */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-[3px] border-l-[3px] border-field-amber opacity-80 shadow-[0_0_10px_rgba(249,168,37,0.5)]" />
        {/* Top-right */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-[3px] border-r-[3px] border-field-amber opacity-80 shadow-[0_0_10px_rgba(249,168,37,0.5)]" />
        {/* Bottom-left */}
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-[3px] border-l-[3px] border-field-amber opacity-80 shadow-[0_0_10px_rgba(249,168,37,0.5)]" />
        {/* Bottom-right */}
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-[3px] border-r-[3px] border-field-amber opacity-80 shadow-[0_0_10px_rgba(249,168,37,0.5)]" />
        
        {/* Center crosshair when analyzing */}
        {isAnalyzing && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Target className="w-16 h-16 text-field-cyan opacity-60 animate-pulse" />
          </div>
        )}
      </div>

      {/* Enhanced scan line with multiple effects */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-field-cyan to-transparent opacity-90 shadow-[0_0_20px_rgba(0,188,212,0.8)]"
            style={{ animation: 'scanline 2s linear infinite' }}
          />
          {/* Pulsing border when analyzing */}
          <div className="absolute inset-0 border-2 border-field-cyan opacity-40 animate-pulse" />
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
      )}

      {/* Placeholder when camera off */}
      {!isActive && !error && (
        <button
          className="
            absolute inset-0 flex flex-col items-center justify-center gap-4
            glass text-field-text-dim
            hover:text-field-amber transition-all duration-300
            group
          "
          onClick={onStart}
          aria-label="Start camera"
        >
          <div className="relative">
            <Camera className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-field-amber/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-sm tracking-[0.3em] uppercase font-bold">
              TAP TO ACTIVATE
            </span>
            <span className="font-mono text-xs tracking-widest uppercase text-field-text-dim">
              VISION SYSTEM
            </span>
          </div>
          <Scan className="w-6 h-6 opacity-50 animate-pulse" />
        </button>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 glass text-field-red p-4">
          <CameraOff className="w-12 h-12 animate-pulse" />
          <span className="font-mono text-sm text-center tracking-wide font-medium">{error}</span>
          <button
            onClick={onStart}
            className="mt-2 px-4 py-2 bg-field-red/20 border border-field-red/50 rounded-lg font-mono text-xs tracking-widest hover:bg-field-red/30 transition-colors"
          >
            RETRY
          </button>
        </div>
      )}

      {/* Enhanced equipment identified overlay */}
      {equipment && isActive && (
        <div
          className="
            absolute bottom-0 left-0 right-0 z-30
            bg-gradient-to-t from-black via-black/95 to-transparent
            px-5 pt-8 pb-4
            border-t border-field-amber/30
            animate-slide-up
          "
        >
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-field-amber animate-pulse shadow-[0_0_10px_rgba(249,168,37,0.8)]" />
                <span className="font-mono text-[10px] text-field-amber tracking-[0.3em] uppercase font-bold">
                  EQUIPMENT IDENTIFIED
                </span>
              </div>
              <div className="font-display text-xl font-black text-white tracking-wide neon-glow">
                {equipment.make} {equipment.model}
              </div>
              {equipment.serial && (
                <div className="font-mono text-[10px] text-field-text-dim tracking-wider mt-1">
                  S/N: {equipment.serial}
                </div>
              )}
              {equipment.lastServiceDate && (
                <div className="font-mono text-[10px] text-field-cyan tracking-wider mt-1">
                  ⚙ LAST SERVICE: {equipment.lastServiceDate}
                </div>
              )}
              {equipment.faultCodes && equipment.faultCodes.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-[9px] text-field-red tracking-widest uppercase">
                    FAULT CODES:
                  </span>
                  {equipment.faultCodes.map((code, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-field-red/20 border border-field-red/50 rounded font-mono text-[10px] text-field-red font-bold"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right ml-4">
              <div className="font-mono text-[9px] text-field-text-dim tracking-[0.25em] uppercase mb-1">
                CONFIDENCE
              </div>
              <div
                className={`
                  font-mono text-2xl font-black
                  ${equipment.confidence > 0.85
                    ? 'text-field-green'
                    : equipment.confidence > 0.6
                    ? 'text-field-amber'
                    : 'text-field-red'}
                `}
              >
                {Math.round(equipment.confidence * 100)}%
              </div>
              <div className="w-full h-1.5 bg-field-panel rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    equipment.confidence > 0.85
                      ? 'bg-field-green'
                      : equipment.confidence > 0.6
                      ? 'bg-field-amber'
                      : 'bg-field-red'
                  }`}
                  style={{ width: `${equipment.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced analyzing label */}
      {isAnalyzing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 px-4 py-2 glass border border-field-cyan/50 rounded-full">
            <Scan className="w-4 h-4 text-field-cyan animate-spin" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-field-cyan uppercase font-bold animate-pulse">
              ANALYZING EQUIPMENT
            </span>
          </div>
        </div>
      )}

      {/* FPS indicator (when active) */}
      {isActive && (
        <div className="absolute top-4 right-4 z-30">
          <div className="px-2 py-1 glass border border-field-border/50 rounded">
            <span className="font-mono text-[9px] text-field-text-dim tracking-wider">
              1 FPS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
