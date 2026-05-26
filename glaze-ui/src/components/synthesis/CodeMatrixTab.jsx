'use client';

import { useState } from 'react';
import CodeVisualizer from './CodeVisualizer';
import InlineChatStream from './InlineChatStream';

export default function CodeMatrixTab({ code, messages, onSendMessage, isStreaming, isProcessing }) {
  const [activeTab, setActiveTab] = useState('code');

  return (
    <div className="h-full min-h-[28rem] rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={[
            'flex-1 rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.32em] transition-colors',
            activeTab === 'code' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white',
          ].join(' ')}
        >
          Code
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={[
            'flex-1 rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.32em] transition-colors',
            activeTab === 'chat' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white',
          ].join(' ')}
        >
          Chat
        </button>
      </div>

      {activeTab === 'code' ? (
        <CodeVisualizer code={code} isProcessing={isProcessing || isStreaming} />
      ) : (
        <InlineChatStream
          messages={messages}
          onSend={onSendMessage}
          isStreaming={isStreaming}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
