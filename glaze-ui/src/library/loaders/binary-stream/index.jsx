'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useWorkspace } from '../../../components/WorkspaceProvider';

const GRID_WIDTH = 16;
const GRID_HEIGHT = 4;

function generateRandomBinary() {
  return Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, () => (Math.random() > 0.5 ? '1' : '0'));
}

export default function BinaryStreamLoader() {
  const [binaryGrid, setBinaryGrid] = useState(generateRandomBinary());
  const [bufferProgress, setBufferProgress] = useState(0);
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const updateIntervalRef = useRef(null);
  const { settings } = useWorkspace();

  const speed = parseFloat(settings.speed) || 1;

  useEffect(() => {
    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const updateFrequency = (0.05 / speed) * 1000; // Adaptive based on speed

    // Random character update loop
    updateIntervalRef.current = setInterval(() => {
      setBinaryGrid((prev) => {
        const updated = [...prev];
        const randomIndices = Array.from({ length: 8 }, () => Math.floor(Math.random() * updated.length));
        randomIndices.forEach((idx) => {
          updated[idx] = Math.random() > 0.5 ? '1' : '0';
        });
        return updated;
      });
    }, updateFrequency);

    // Buffer progress animation
    timelineRef.current = gsap.timeline({ repeat: -1 });
    timelineRef.current.to(
      { progress: 0 },
      {
        progress: 1,
        duration: 2 / speed,
        ease: 'power1.inOut',
        onUpdate: function () {
          setBufferProgress(this.targets()[0].progress);
        },
      }
    );

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [speed]);

  const lockedRowCount = Math.floor(bufferProgress * GRID_HEIGHT);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 px-6 py-5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <div className="font-mono text-[0.65rem] leading-tight tracking-widest">
        {Array.from({ length: GRID_HEIGHT }, (_, row) => {
          const isLocked = row < lockedRowCount;
          return (
            <div
              key={row}
              className={`transition-all duration-200 ${
                isLocked
                  ? 'text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                  : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]'
              }`}
            >
              {Array.from({ length: GRID_WIDTH }, (_, col) => binaryGrid[row * GRID_WIDTH + col])}
            </div>
          );
        })}
      </div>
    </div>
  );
}
