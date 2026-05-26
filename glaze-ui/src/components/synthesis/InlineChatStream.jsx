'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

export default function InlineChatStream({ messages = [], onSend, isStreaming = false, isProcessing = false }) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const node = scrollRef.current;

    if (!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
  }, [messages, isStreaming]);

  const submitMessage = () => {
    const trimmed = draft.trim();

    if (!trimmed || isProcessing || isStreaming) {
      return;
    }

    onSend?.(trimmed);
    setDraft('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className="flex h-full min-h-[28rem] flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">Inline Chat</div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-auto rounded-xl border border-white/10 bg-black/40 p-3">
        {messages.length === 0 ? (
          <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">No modifications yet</div>
        ) : (
          messages.map((message, index) => {
            const isUser = message.role === 'user';

            return (
              <div key={`${message.role}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={[
                    'max-w-[92%] rounded-2xl border px-3 py-2 text-xs leading-relaxed',
                    isUser
                      ? 'border-cyan-400/30 bg-cyan-500/15 text-cyan-100'
                      : 'border-white/10 bg-white/[0.05] text-zinc-200',
                  ].join(' ')}
                >
                  {message.content}
                </div>
              </div>
            );
          })
        )}

        {isStreaming ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.26em] text-cyan-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
            Streaming revision
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-end gap-2 rounded-2xl border border-white/10 bg-black/60 p-2">
        <textarea
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Refine this component (Ctrl/Cmd+Enter to send)..."
          disabled={isProcessing || isStreaming}
          className="max-h-28 min-h-[2.6rem] flex-1 resize-y bg-transparent px-2 py-1 text-sm text-white outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="button"
          onClick={submitMessage}
          disabled={isProcessing || isStreaming || !draft.trim()}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} />
          Send
        </button>
      </div>
    </div>
  );
}
