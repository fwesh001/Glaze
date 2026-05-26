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
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingCode, setStreamingCode] = useState('');
  const [finalizedCode, setFinalizedCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [physicsState, setPhysicsState] = useState({
    viscosity: 1,
    blur: 20,
    mass: 1,
  });
  const [error, setError] = useState(null);

  const handlePhysicsChange = (key, value) => {
    setPhysicsState((prev) => ({ ...prev, [key]: value }));
  };

  const streamCodeTokens = (nextCode) =>
    new Promise((resolve) => {
      const tokenParts = nextCode.split(/(\s+)/).filter((part) => part.length > 0);

      if (tokenParts.length === 0) {
        setStreamingCode('');
        resolve();
        return;
      }

      let index = 0;
      let accumulated = '';

      const interval = window.setInterval(() => {
        accumulated += tokenParts[index] ?? '';
        setStreamingCode(accumulated);
        index += 1;

        if (index >= tokenParts.length) {
          window.clearInterval(interval);
          resolve();
        }
      }, 10);
    });

  const runSynthesisTurn = async ({ userMessage, seedCode, mode }) => {
    setIsProcessing(true);
    setIsStreaming(true);
    setError(null);

    const userEntry = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, userEntry]);

    try {
      const response = await fetch('/api/morph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage: 'React',
          currentCode: seedCode,
          sliderMetadata: physicsState,
          userMessage,
          sourceCode: seedCode,
          message: userMessage,
          sourceFramework: mode === 'code' ? 'auto' : 'prompt',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to synthesize code using Hugging Face.');
      }

      await streamCodeTokens(result.code);

      setFinalizedCode(result.code);
      setStreamingCode(result.code);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Applied. Code matrix updated.' }]);

      setSubmittedInput((prev) => ({
        ...(prev ?? { type: mode, text: userMessage }),
        code: result.code,
      }));
    } catch (err) {
      console.error('[synthesis] API Error:', err);
      setError(err.message || 'Unable to connect to the Hugging Face AI service.');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Request failed. Please retry with a smaller change.' }]);
      throw err;
    } finally {
      setIsStreaming(false);
      setIsProcessing(false);
    }
  };

  const handleOmniInputSubmit = async (data) => {
    const isFirstSubmit = !submittedInput;

    if (isFirstSubmit) {
      const initialCode = data.text;

      setSubmittedInput({
        ...data,
        code: initialCode,
      });

      setStreamingCode(initialCode);
      setFinalizedCode(initialCode);
      setMessages([]);
    }

    try {
      const seedCode = isFirstSubmit ? data.text : finalizedCode || submittedInput?.code || data.text;

      await runSynthesisTurn({
        userMessage: data.text,
        seedCode,
        mode: data.type,
      });
    } catch (err) {
      if (isFirstSubmit) {
        setSubmittedInput(null);
        setStreamingCode('');
        setFinalizedCode('');
        setMessages([]);
      }
    }
  };

  const handleInlineSend = async (messageText) => {
    if (!submittedInput) {
      return;
    }

    const seedCode = finalizedCode || submittedInput.code || streamingCode;

    try {
      await runSynthesisTurn({
        userMessage: messageText,
        seedCode,
        mode: submittedInput.type,
      });
    } catch {
      return;
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
            mode={submittedInput.type}
            renderCode={isStreaming ? streamingCode : finalizedCode}
            previewCode={finalizedCode}
            isLoading={isProcessing}
            isStreaming={isStreaming}
            physics={physicsState}
            onPhysicsChange={handlePhysicsChange}
            messages={messages}
            onSendMessage={handleInlineSend}
          />
        </div>
      )}

      {/* Render OmniInput only for initial seed submission */}
      {isAuthenticated && !submittedInput && (
        <OmniInput onSubmit={handleOmniInputSubmit} isProcessing={isProcessing} />
      )}
    </div>
  );
}
