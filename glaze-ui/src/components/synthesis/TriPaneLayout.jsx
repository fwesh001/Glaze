'use client';

import LiveCanvas from './LiveCanvas';
import CodeMatrixTab from './CodeMatrixTab';
import PhysicsDeck from './PhysicsDeck';

export default function TriPaneLayout({
  mode = null,
  renderCode = '',
  previewCode = '',
  isLoading = false,
  isStreaming = false,
  physics,
  onPhysicsChange,
  messages,
  onSendMessage,
}) {
  if (!mode) {
    return null;
  }

  return (
    <div className="grid h-screen grid-cols-[40%_40%_20%] gap-4 bg-black p-4">
      <LiveCanvas code={previewCode} physics={physics} isProcessing={isLoading} />
      <CodeMatrixTab
        code={renderCode}
        messages={messages}
        onSendMessage={onSendMessage}
        isStreaming={isStreaming}
        isProcessing={isLoading}
      />
      <PhysicsDeck physics={physics} onChange={onPhysicsChange} />
    </div>
  );
}
