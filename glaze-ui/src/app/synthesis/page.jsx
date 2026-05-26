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
  const [error, setError] = useState(null);

  const handleOmniInputSubmit = async (data) => {
    setIsProcessing(true);
    setError(null);

    const isFirstSubmit = !submittedInput;
    
    // Immediately transition to the workspace view with their input code/prompt
    if (isFirstSubmit) {
      setSubmittedInput({
        ...data,
        code: data.text,
      });
    }

    try {
      const payload = {
        targetLanguage: 'React',
      };

      if (isFirstSubmit) {
        if (data.type === 'code') {
          payload.sourceCode = data.text;
        } else {
          payload.message = data.text;
        }
      } else {
        // Refinement Loop: Send previous generated code and new prompt/changes instruction
        payload.sourceCode = submittedInput.code;
        payload.message = data.text;
      }

      const response = await fetch('/api/morph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to synthesize code using Hugging Face.');
      }

      setSubmittedInput((prev) => ({
        ...prev,
        code: result.code,
      }));
    } catch (err) {
      console.error('[synthesis] API Error:', err);
      setError(err.message || 'Unable to connect to the Hugging Face AI service.');
      
      if (isFirstSubmit) {
        // Reset state so user isn't stuck on empty workspace if initial prompt fails
        setSubmittedInput(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black">
      <AuthGate />

      {error && (
        <div className="fixed top-6 left-1/2 z-[10000] w-full max-w-md -translate-x-1/2 rounded-2xl border border-red-500/30 bg-black/90 p-5 text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] backdrop-blur-xl">
          <div className="text-sm font-semibold text-red-400">Synthesis Engine Error</div>
          <div className="mt-2 text-xs text-zinc-400 leading-relaxed">{error}</div>
          <button 
            onClick={() => setError(null)} 
            className="mt-4 rounded-full bg-red-950/40 px-4 py-1.5 text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-950/70 transition-all cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Render the workspace once user submits initial prompt/code */}
      {isAuthenticated && submittedInput && (
        <div className="pb-24">
          <TriPaneLayout 
            initialMode={submittedInput.type} 
            initialCode={submittedInput.code} 
            isLoading={isProcessing} 
          />
        </div>
      )}

      {/* Render the OmniInput so it can run its docking GSAP animations */}
      {isAuthenticated && (
        <OmniInput onSubmit={handleOmniInputSubmit} isProcessing={isProcessing} />
      )}
    </div>
  );
}
