'use client';

import CodeVisualizer from './CodeVisualizer';
import InlineChatStream from './InlineChatStream';

export default function CodeMatrixTab({ code, messages, onSendMessage, isStreaming, isProcessing }) {
  return (
    <div className="grid h-full min-h-[28rem] grid-cols-[65%_35%] gap-4">
      <CodeVisualizer code={code} isProcessing={isProcessing || isStreaming} />
      <InlineChatStream
        messages={messages}
        onSend={onSendMessage}
        isStreaming={isStreaming}
        isProcessing={isProcessing}
      />
    </div>
  );
}
