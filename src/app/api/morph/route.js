import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Server route that forwards component/code morph requests to Hugging Face
// Expects `HF_TOKEN` in environment variables.

const SYSTEM_PROMPT = `You are the Glaze UI production code compiler. Your task is to translate the provided baseline component snippet into clean, working code for the requested Target Framework (React, Vue, or Vanilla JS) styled with Tailwind CSS utility parameters.

CRITICAL FORMATTING RULE: You must output ONLY the raw, clean, functional code string. Do NOT enclose the response in markdown code blocks (such as ```jsx ... ```). Do NOT include conversational greetings, explanations, or footnotes. Start immediately with the code payload.`;

export async function POST(req) {
  try {
    const body = await req.json();
    // Normalize incoming payload fields (ControlPanel.jsx should send these)
    const {
      targetLanguage,
      componentId,
      message,
      viscosity,
      blur,
      baseCode,
    } = body || {};

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json({ success: false, error: 'HF_TOKEN not configured' }, { status: 500 });
    }

    const hf = new HfInference(token);

    // Build chat messages: strict system prompt then user payload
    const userContent = JSON.stringify({ targetLanguage, componentId, message, viscosity, blur, baseCode });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ];

    // Preferred model (fallback supported by HF account plan)
    const model = 'meta-llama/Meta-Llama-3-8B-Instruct';

    // Call the Hugging Face chat completion endpoint
    const resp = await hf.chatCompletion({ model, messages });

    // Extract text robustly from varied HF response shapes
    let codeText = '';

    if (resp) {
      if (resp.choices && Array.isArray(resp.choices) && resp.choices.length > 0) {
        const first = resp.choices[0];
        if (first.message && first.message.content) {
          const content = first.message.content;
          if (Array.isArray(content)) {
            codeText = content.map(c => c?.text ?? c?.content ?? '').join('');
          } else if (typeof content === 'string') {
            codeText = content;
          } else if (typeof content === 'object') {
            codeText = content.text ?? content.content ?? '';
          }
        } else if (first.text) {
          codeText = first.text;
        }
      }

      if (!codeText && resp.generated_text) codeText = resp.generated_text;
      if (!codeText && Array.isArray(resp.output) && resp.output[0]?.generated_text) codeText = resp.output[0].generated_text;
    }

    // Final safety: trim and ensure string
    codeText = (codeText || '').toString().trim();

    if (!codeText) {
      // If no code returned, surface HF response for debugging
      return NextResponse.json({ success: false, error: 'Empty response from HF', debug: resp }, { status: 502 });
    }

    // Return the code payload in a simple JSON shape expected by ControlPanel
    return NextResponse.json({ success: true, code: codeText });
  } catch (err) {
    // Handle rate limits and downtime gracefully
    const message = (err && err.message) ? err.message : String(err);
    console.error('[morph/route] Error calling HF:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
