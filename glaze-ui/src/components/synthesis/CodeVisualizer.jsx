'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeVisualizer({ code, isProcessing }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl overflow-hidden">
      <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">Code Matrix</div>
      <div className={`h-[calc(100%-2.5rem)] overflow-auto rounded-xl border border-white/10 bg-[#07070a] ${isProcessing ? 'opacity-50' : ''}`}>
        <SyntaxHighlighter
          language="jsx"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#07070a',
            fontSize: '0.75rem',
            lineHeight: '1.5',
          }}
        >
          {code || '// Code will appear here'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
