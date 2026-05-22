'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useWorkspace } from '../../../components/WorkspaceProvider';

const BLOCK_COUNT = 10;
const BLOCK_WIDTH = 24;
const BLOCK_HEIGHT = 48;
const GAP = 8;

export default function MemoryBlocksLoader() {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const [blockStates, setBlockStates] = useState(Array(BLOCK_COUNT).fill('empty'));
  const { settings } = useWorkspace();

  const speed = parseFloat(settings.speed) || 1;

  useEffect(() => {
    if (!containerRef.current) return;

    if (timelineRef.current) timelineRef.current.kill();

    setBlockStates(Array(BLOCK_COUNT).fill('empty'));

    timelineRef.current = gsap.timeline({ repeat: -1 });

    // Data allocation sequence
    for (let i = 0; i < BLOCK_COUNT; i++) {
      timelineRef.current.call(
        () => {
          setBlockStates((prev) => {
            const next = [...prev];

            // 30% chance of retry (red flicker)
            if (Math.random() < 0.3) {
              next[i] = 'retry';
              setTimeout(() => {
                setBlockStates((p) => {
                  const updated = [...p];
                  updated[i] = 'loading';
                  return updated;
                });
              }, 150 / speed);
            } else {
              next[i] = 'loading';
            }

            return next;
          });
        },
        i * (0.15 / speed)
      );

      timelineRef.current.call(
        () => {
          setBlockStates((prev) => {
            const next = [...prev];
            next[i] = 'allocated';
            return next;
          });
        },
        i * (0.15 / speed) + 0.25 / speed
      );
    }

    // Hold briefly then reset
    timelineRef.current.to({}, { duration: 0.5 / speed });
    timelineRef.current.call(() => {
      setBlockStates(Array(BLOCK_COUNT).fill('empty'));
    });

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [speed]);

  const getBlockColor = (state) => {
    if (state === 'retry') return 'bg-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.6)]';
    if (state === 'allocated') return 'bg-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.6)]';
    if (state === 'loading') return 'bg-yellow-500/70 shadow-[0_0_12px_rgba(234,179,8,0.4)]';
    return 'bg-white/10';
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 px-6 py-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div ref={containerRef} className="flex gap-2">
        {blockStates.map((state, i) => (
          <div
            key={i}
            className={`rounded-lg border border-white/10 transition-all duration-75 ${getBlockColor(state)}`}
            style={{
              width: BLOCK_WIDTH,
              height: BLOCK_HEIGHT,
              transform: state === 'loading' ? 'scaleY(1.1)' : 'scaleY(1)',
            }}
          />
        ))}
      </div>
      <div className="text-[0.65rem] text-zinc-400">RAM Sector Allocation</div>
    </div>
  );
}
