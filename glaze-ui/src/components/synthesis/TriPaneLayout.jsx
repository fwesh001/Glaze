'use client';

import { useState } from 'react';
import LiveCanvas from './LiveCanvas';
import CodeVisualizer from './CodeVisualizer';
import PhysicsDeck from './PhysicsDeck';

export default function TriPaneLayout({ initialMode = null, initialCode = null }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMode, setCurrentMode] = useState(initialMode || null);
  const [aiResponsePayload, setAiResponsePayload] = useState(initialCode || null);
  const [physicsState, setPhysicsState] = useState({
    viscosity: 1,
    blur: 20,
    mass: 1,
  });

  const handlePhysicsChange = (key, value) => {
    setPhysicsState((prev) => ({ ...prev, [key]: value }));
  };

  if (!currentMode || !aiResponsePayload) {
    return null;
  }

  return (
    <div className="grid h-screen grid-cols-[40%_40%_20%] gap-4 bg-black p-4">
      <LiveCanvas code={aiResponsePayload} physics={physicsState} isProcessing={isProcessing} />
      <CodeVisualizer code={aiResponsePayload} isProcessing={isProcessing} />
      <PhysicsDeck physics={physicsState} onChange={handlePhysicsChange} />
    </div>
  );
}
