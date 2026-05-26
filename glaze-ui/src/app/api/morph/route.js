import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const SYSTEM_PROMPT = [
  'You are the Glaze UI Code Matrix compiler for multi-turn edits.',
  'Treat currentCode as the single source of truth. Apply only the userMessage delta to currentCode and preserve all unrelated logic.',
  'Preserve untouched glassmorphism Tailwind classes, spacing rhythm, and GSAP timelines unless userMessage explicitly requests changing them.',
  'Accept source code from any framework or language (React, Vue, Svelte, TypeScript, Vanilla JS, HTML) and normalize the result into one self-contained React functional component using hooks.',
  'Strip TypeScript-only syntax to valid JavaScript.',
  'Replace fetch, axios, REST, websocket, and external network dependencies with local mock state/timers so the component runs without network access.',
  'Replace imperative DOM calls (document.getElementById/querySelector/innerHTML) with declarative React state and JSX.',
  'Use sliderMetadata values (viscosity, blur, mass) only when relevant for style/behavior tuning.',
  'Return only the revised React component code. No markdown fences, no explanations, no prose.',
].join('\n');

const MODEL_NAME = 'meta-llama/Meta-Llama-3-8B-Instruct';

function normalizePayload(body = {}) {
  const workspaceState = body.workspaceState ?? {};
  const sliderMetadata = body.sliderMetadata ?? workspaceState.sliderMetadata ?? {};
  const sourceCode = body.sourceCode ?? body.baseCode ?? body.snippet ?? body.message ?? '';
  const currentCode = body.currentCode ?? sourceCode;
  const userMessage = body.userMessage ?? body.message ?? workspaceState.message ?? '';

  return {
    targetLanguage: body.targetLanguage ?? workspaceState.targetLanguage ?? 'React',
    componentId: body.componentId ?? body.registryMeta?.id ?? '',
    message: userMessage,
    userMessage,
    currentCode,
    sliderMetadata: {
      viscosity: Number(sliderMetadata.viscosity ?? body.viscosity ?? workspaceState.viscosity ?? 1),
      blur: Number(sliderMetadata.blur ?? body.blur ?? workspaceState.blur ?? 20),
      mass: Number(sliderMetadata.mass ?? workspaceState.mass ?? 1),
    },
    sourceLanguage: body.sourceLanguage ?? workspaceState.sourceLanguage ?? guessSourceLanguage(sourceCode),
    sourceFramework: body.sourceFramework ?? workspaceState.sourceFramework ?? guessSourceFramework(sourceCode),
    sourceCode,
    viscosity: body.viscosity ?? workspaceState.viscosity ?? 1,
    blur: body.blur ?? workspaceState.blur ?? 20,
    baseCode: body.baseCode ?? body.snippet ?? sourceCode,
  };
}

function guessSourceLanguage(sourceCode = '') {
  const value = String(sourceCode);

  if (!value.trim()) return 'unknown';
  if (/\binterface\b|\btype\s+\w+\s*=|:\s*[A-Z][A-Za-z0-9_<>,\[\]\| ]*/.test(value)) return 'TypeScript';
  if (/\bclass\s+\w+\s+extends\s+HTMLElement\b|customElements\.define\(/.test(value)) return 'Vanilla JavaScript';
  if (/<template[\s>]|<script\s+setup|defineProps\(/.test(value)) return 'Vue';
  if (/<svelte:|on:|bind:|\$:\s/.test(value)) return 'Svelte';
  if (/<[A-Za-z][\s\S]*>|document\.(getElementById|querySelector)/.test(value)) return 'HTML/JavaScript';

  return 'JavaScript';
}

function guessSourceFramework(sourceCode = '') {
  const value = String(sourceCode);

  if (!value.trim()) return 'auto';
  if (/<template[\s>]|<script\s+setup|defineProps\(/.test(value)) return 'Vue';
  if (/<svelte:|on:|bind:|\$:\s/.test(value)) return 'Svelte';
  if (/customElements\.define\(|document\.(getElementById|querySelector)|class\s+\w+\s+extends\s+HTMLElement/.test(value)) return 'Vanilla JS';
  if (/import\s+React|from\s+['"]react['"]|useState\(|useEffect\(/.test(value)) return 'React';
  if (/interface\b|type\s+\w+\s*=|:\s*[A-Za-z0-9_<>,\[\]\| ]+/.test(value)) return 'TypeScript';

  return 'auto';
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

function stripMarkdownFences(code = '') {
  const text = String(code).trim();

  if (!text) return '';

  const fencedMatch = text.match(/^```(?:jsx|tsx|js|javascript|ts|typescript|vue|svelte|html|react|text)?\s*([\s\S]*?)```$/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return text
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
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
          userMessage: payload.userMessage,
          currentCode: payload.currentCode,
          sliderMetadata: payload.sliderMetadata,
          sourceLanguage: payload.sourceLanguage,
          sourceFramework: payload.sourceFramework,
          sourceCode: payload.sourceCode,
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

    const code = stripMarkdownFences(extractGeneratedText(response));

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
      sourceLanguage: payload.sourceLanguage,
      sourceFramework: payload.sourceFramework,
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
