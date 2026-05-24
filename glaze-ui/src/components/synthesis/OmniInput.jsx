'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

function detectInputType(text) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const trimmed = text.trim();

  // Check for code indicators
  const codePatterns = [
    /[<>{}[\]()]/g, // HTML/JSX/code brackets
    /className=|style=|function|const |let |var |import |export /i, // JS keywords
    /^\s*<\w+/m, // Opens with tag
    /CSS|@media|@keyframes/i, // CSS keywords
  ];

  const codeScore = codePatterns.reduce((score, pattern) => score + (trimmed.match(pattern) ? 1 : 0), 0);

  return codeScore >= 2 ? 'code' : 'natural';
}

export default function OmniInput({ onSubmit, isProcessing }) {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState(null);
  const [isCompressed, setIsCompressed] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const detected = detectInputType(inputValue);
    setInputType(detected);
  }, [inputValue]);

  const handleSubmit = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && inputValue.trim()) {
      e.preventDefault();
      
      // Compress the input
      if (containerRef.current && inputRef.current) {
        gsap.to(containerRef.current, {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 'auto',
          duration: 0.5,
          ease: 'power3.inOut',
          onStart: () => setIsCompressed(true),
        });

        gsap.to(inputRef.current, {
          height: '3rem',
          duration: 0.5,
          ease: 'power3.inOut',
        });
      }

      // Call the parent with submission data
      if (onSubmit) {
        onSubmit({
          text: inputValue,
          type: inputType,
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${
        isCompressed
          ? 'fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-xl'
          : 'min-h-screen w-full flex items-center justify-center bg-black px-4'
      }`}
    >
      <div className={isCompressed ? 'mx-auto w-full max-w-4xl px-6 py-3' : 'w-full max-w-2xl'}>
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSubmit}
          placeholder="Describe a component, or paste raw code to Glaze it..."
          disabled={isProcessing}
          className={`w-full rounded-2xl border border-white/10 bg-white/[0.03] font-mono text-white outline-none placeholder:text-zinc-500 transition-all ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            isCompressed
              ? 'resize-none text-xs py-2 px-4'
              : 'resize-none text-lg py-8 px-6 min-h-32 shadow-[0_0_48px_rgba(34,211,238,0.1)]'
          } ${
            inputType === 'code'
              ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_24px_rgba(34,211,238,0.15)]'
              : inputType === 'natural'
              ? 'border-white/20'
              : ''
          }`}
        />
        {!isCompressed && (
          <div className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-zinc-500">
            {inputType === 'code' ? (
              <span className="text-cyan-400">Code Detection Active</span>
            ) : inputType === 'natural' ? (
              <span>Natural Language Detected</span>
            ) : (
              <span>Cmd+Enter to Submit</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
