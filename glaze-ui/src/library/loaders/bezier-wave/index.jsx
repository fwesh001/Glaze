'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useWorkspace } from '../../../components/WorkspaceProvider';

const WAVE_HEIGHT = 60;
const WAVE_WIDTH = 300;
const CENTER_Y = WAVE_HEIGHT / 2;

function generateWavePath(frequency, amplitude, phase) {
  const points = [];
  const steps = 120;

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * WAVE_WIDTH;
    const y = CENTER_Y + Math.sin((x / WAVE_WIDTH) * frequency * Math.PI * 2 + phase) * amplitude;
    points.push([x, y]);
  }

  // Create Bezier path
  let pathData = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i][0]} ${points[i][1]}`;
  }

  return pathData;
}

export default function BezierWaveLoader() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const timelineRef = useRef(null);
  const { settings } = useWorkspace();

  const speed = parseFloat(settings.speed) || 1;
  const amplitude = parseFloat(settings.amplitude) || 15;
  const frequency = parseFloat(settings.frequency) || 1;

  useEffect(() => {
    if (timelineRef.current) timelineRef.current.kill();

    const state = { phase: 0 };

    timelineRef.current = gsap.timeline({ repeat: -1 });

    timelineRef.current.to(
      state,
      {
        phase: Math.PI * 2,
        duration: 3 / speed,
        ease: 'none',
        onUpdate: () => {
          if (pathRef.current) {
            const newPath = generateWavePath(frequency, amplitude * 10, state.phase);
            pathRef.current.setAttribute('d', newPath);
          }
        },
      },
      0
    );

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [speed, amplitude, frequency]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 px-6 py-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      {/* Grid background */}
      <svg width={WAVE_WIDTH + 20} height={WAVE_HEIGHT + 20} className="absolute opacity-20">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={WAVE_WIDTH + 20} height={WAVE_HEIGHT + 20} fill="url(#grid)" />
      </svg>

      {/* Wave path */}
      <svg width={WAVE_WIDTH + 20} height={WAVE_HEIGHT + 20} className="relative">
        <path
          ref={pathRef}
          d={generateWavePath(frequency, amplitude * 10, 0)}
          fill="none"
          stroke="rgba(34, 211, 238, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))"
        />
      </svg>

      <div className="text-[0.65rem] text-zinc-400">Amplitude {amplitude.toFixed(1)} | Freq {frequency.toFixed(1)}</div>
    </div>
  );
}
