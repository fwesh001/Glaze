'use client';

import { useRef, useState, useEffect } from 'react';
import { Send } from 'lucide-react';
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

  const submitInput = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

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

    if (onSubmit) {
      onSubmit({
        text: trimmedValue,
        type: inputType,
      });
    }

    setInputValue('');
  };

  const handleSubmit = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && inputValue.trim()) {
      e.preventDefault();
      submitInput();
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
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-center text-xs uppercase tracking-[0.3em] text-zinc-500">
              {inputType === 'code' ? (
                <span className="text-cyan-400">Code Detection Active</span>
              ) : inputType === 'natural' ? (
                <span>Natural Language Detected</span>
              ) : (
                <span>Cmd+Enter to Submit</span>
              )}
            </div>

            <button
              type="button"
              onClick={submitInput}
              disabled={isProcessing || !inputValue.trim()}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200 transition-colors hover:border-cyan-300/50 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={14} />
              Send
            </button>
          </div>
      </div>
    </div>
  );
}
