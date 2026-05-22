'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useWorkspace } from '../../../components/WorkspaceProvider';

const SPIRAL_SIZE = 200;

function generateFibonacciSpiral(turns) {
  const points = [];
  const increment = 0.1;
  const maxRadius = SPIRAL_SIZE / 2;

  for (let i = 0; i < turns * 2 * Math.PI; i += increment) {
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const radius = (maxRadius / (turns * 2 * Math.PI)) * i;
    const x = SPIRAL_SIZE / 2 + radius * Math.cos(i);
    const y = SPIRAL_SIZE / 2 + radius * Math.sin(i);
    points.push([x, y]);
  }

  // Create SVG path
  let pathData = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i][0]} ${points[i][1]}`;
  }

  return pathData;
}

export default function FibonacciSpiralLoader() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const timelineRef = useRef(null);
  const { settings } = useWorkspace();

  const speed = parseFloat(settings.speed) || 1;

  useEffect(() => {
    if (!pathRef.current) return;

    if (timelineRef.current) timelineRef.current.kill();

    const fullPath = generateFibonacciSpiral(3);
    const pathLength = pathRef.current.getTotalLength();

    pathRef.current.setAttribute('stroke-dasharray', pathLength);
    pathRef.current.setAttribute('stroke-dashoffset', pathLength);

    timelineRef.current = gsap.timeline({ repeat: -1 });

    // Forward trace - accelerating inward
    timelineRef.current.to(
      pathRef.current,
      {
        strokeDashoffset: 0,
        duration: 2.5 / speed,
        ease: 'power2.in',
      },
      0
    );

    // Pulse opacity
    timelineRef.current.to(
      pathRef.current,
      {
        opacity: 1,
        duration: 0.4 / speed,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: Math.floor(2.5 / (0.4 / speed) / 2),
      },
      0
    );

    // Reset for next cycle
    timelineRef.current.to(pathRef.current, { strokeDashoffset: pathLength }, 2.5 / speed);
    timelineRef.current.to(pathRef.current, { duration: 0.2 / speed }, `+=-0.2`);

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [speed]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 px-6 py-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <svg ref={svgRef} width={SPIRAL_SIZE} height={SPIRAL_SIZE} className="drop-shadow-lg">
        <defs>
          <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0.9)" />
          </linearGradient>
        </defs>
        <path ref={pathRef} d={generateFibonacciSpiral(3)} fill="none" stroke="url(#spiralGradient)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="text-[0.65rem] text-zinc-400">Golden Ratio Accelerant</div>
    </div>
  );
}
