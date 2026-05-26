'use client';

import { useState } from 'react';
import useMockSession from '../../components/auth/useMockSession';
import AuthGate from '../../components/synthesis/AuthGate';
import OmniInput from '../../components/synthesis/OmniInput';
import TriPaneLayout from '../../components/synthesis/TriPaneLayout';

export default function SynthesisPage() {
  const { isAuthenticated } = useMockSession();
  const [submittedInput, setSubmittedInput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOmniInputSubmit = (data) => {
    setSubmittedInput({
      ...data,
      code: '// Processing your input...',
    });
    setIsProcessing(true);

    // Simulate processing delay (would call HF API here later)
    setTimeout(() => {
      setIsProcessing(false);
      setSubmittedInput((prev) => ({
        ...prev,
        code: `// Generated from ${prev.type} input\n// Your component preview will render here`,
      }));
    }, 1200);
  };

  return (
    <div className="relative w-full">
      <AuthGate />

      {isAuthenticated && !submittedInput && <OmniInput onSubmit={handleOmniInputSubmit} isProcessing={isProcessing} />}

      {isAuthenticated && submittedInput && (
        <TriPaneLayout initialMode={submittedInput.type} initialCode={submittedInput.code} isLoading={isProcessing} />
      )}
    </div>
  );
}
