import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const SYSTEM_PROMPT = [
  'You are the Glaze UI production code compiler. Your task is to translate the provided baseline component snippet into clean, working code for the requested Target Framework (React, Vue, or Vanilla JS) styled with Tailwind CSS utility parameters.',
  '',
  'CRITICAL FORMATTING RULE: You must output ONLY the raw, clean, functional code string. Do NOT enclose the response in markdown code blocks (such as ```jsx ... ```). Do NOT include conversational greetings, explanations, or footnotes. Start immediately with the code payload.',
].join('\n');

const MODEL_NAME = 'meta-llama/Meta-Llama-3-8B-Instruct';

function normalizePayload(body = {}) {
  const workspaceState = body.workspaceState ?? {};

  return {
    targetLanguage: body.targetLanguage ?? workspaceState.targetLanguage ?? 'React',
    componentId: body.componentId ?? body.registryMeta?.id ?? '',
    message: body.message ?? workspaceState.message ?? '',
    viscosity: body.viscosity ?? workspaceState.viscosity ?? 1,
    blur: body.blur ?? workspaceState.blur ?? 20,
    baseCode: body.baseCode ?? body.snippet ?? '',
  };
}

function extractGeneratedText(response) {
  if (!response) return '';

  const choices = Array.isArray(response.choices) ? response.choices : [];
  const firstChoice = choices[0];
  const content = firstChoice?.message?.content;

  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => part?.text ?? part?.content ?? '')
      .join('')
      .trim();
  }

  if (typeof content === 'object' && content) {
    return (content.text ?? content.content ?? '').toString().trim();
  }

  if (typeof firstChoice?.text === 'string') {
    return firstChoice.text.trim();
  }

  if (typeof response.generated_text === 'string') {
    return response.generated_text.trim();
  }

  if (Array.isArray(response.output) && typeof response.output[0]?.generated_text === 'string') {
    return response.output[0].generated_text.trim();
  }

  return '';
}

export async function POST(request) {
  try {
    const token = process.env.HF_TOKEN;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'HF_TOKEN is not configured.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const payload = normalizePayload(body);
    const hf = new HfInference(token);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: JSON.stringify({
          targetLanguage: payload.targetLanguage,
          componentId: payload.componentId,
          message: payload.message,
          viscosity: payload.viscosity,
          blur: payload.blur,
          baseCode: payload.baseCode,
        }),
      },
    ];

    const response = await hf.chatCompletion({
      model: MODEL_NAME,
      messages,
    });

    const code = extractGeneratedText(response);

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Hugging Face returned an empty response.', debug: response },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      code,
      language: payload.targetLanguage,
      componentId: payload.componentId,
    });
  } catch (error) {
    const status = error?.status === 429 ? 429 : error?.status === 503 ? 503 : 500;
    const message = error?.message ?? 'Unable to reach the Hugging Face inference service.';

    console.error('[api/morph] Hugging Face request failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}
