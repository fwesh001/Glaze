'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './style.css';

const GLYPHS = '01#@$%&*+-<>?';

function withFlicker(line, lockedChars) {
  return line
    .split('')
    .map((char, index) => {
      if (index < lockedChars || char === ' ') return char;
      if (Math.random() > 0.72) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      return ' ';
    })
    .join('');
}

export default function TelemetryTickerToast({
  message = 'Diagnostic bus synchronized',
  lines = 4,
  speed = 1,
}) {
  const rootRef = useRef(null);
  const tickRef = useRef(null);
  const resetRef = useRef(null);
  const [rendered, setRendered] = useState([]);
  const count = Math.max(3, Math.min(6, Number(lines) || 4));
  const normalizedSpeed = Math.max(0.35, Number(speed) || 1);

  const sourceLines = useMemo(() => {
    const base = [
      `[SYS] ${message}`,
      '[BUS] I/O lanes synchronized',
      '[RAM] telemetry cache warm',
      '[NET] uplink secure',
      '[GPU] compositor stable',
      '[CPU] scheduler nominal',
    ];
    return base.slice(0, count);
  }, [message, count]);

  useEffect(() => {
    gsap.fromTo(rootRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.24, ease: 'power3.out' });

    let lineIndex = 0;
    let charIndex = 0;
    const frame = Math.max(24, 42 / normalizedSpeed);

    setRendered(sourceLines.map(() => ''));

    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => {
      setRendered((prev) => {
        const next = [...prev];
        const line = sourceLines[lineIndex];

        if (!line) return prev;

        if (charIndex <= line.length) {
          next[lineIndex] = withFlicker(line, charIndex);
          charIndex += 1;
          return next;
        }

        next[lineIndex] = line;
        lineIndex += 1;
        charIndex = 0;

        if (lineIndex >= sourceLines.length) {
          if (tickRef.current) window.clearInterval(tickRef.current);
          resetRef.current = window.setTimeout(() => {
            lineIndex = 0;
            charIndex = 0;
            setRendered(sourceLines.map(() => ''));
            tickRef.current = window.setInterval(() => {
              setRendered((current) => {
                const updated = [...current];
                const currentLine = sourceLines[lineIndex];
                if (!currentLine) return current;
                if (charIndex <= currentLine.length) {
                  updated[lineIndex] = withFlicker(currentLine, charIndex);
                  charIndex += 1;
                  return updated;
                }
                updated[lineIndex] = currentLine;
                lineIndex += 1;
                charIndex = 0;
                if (lineIndex >= sourceLines.length && tickRef.current) {
                  window.clearInterval(tickRef.current);
                }
                return updated;
              });
            }, frame);
          }, 500);
        }

        return next;
      });
    }, frame);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (resetRef.current) window.clearTimeout(resetRef.current);
      gsap.killTweensOf(rootRef.current);
    };
  }, [sourceLines, normalizedSpeed]);

  return (
    <div ref={rootRef} className="telemetry-ticker px-5 py-4">
      <div className="mb-2 text-[0.62rem] uppercase tracking-[0.35em] text-emerald-300/80">Hardware Telemetry</div>
      {rendered.map((line, index) => (
        <div key={index} className="telemetry-line">
          {line || '\u00A0'}
        </div>
      ))}
    </div>
  );
}
