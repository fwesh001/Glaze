import { NextResponse } from 'next/server';

import { BASE_TOAST_SNIPPET, buildMorphCode } from '../../../lib/morph.js';

const SYSTEM_PROMPT =
  'You are the Glaze UI core code compiler. Take the provided base Glassmorphic component code blueprint, apply the following exact telemetry configuration attributes, and rewrite it cleanly into the requested Target Framework syntax using structural best practices.';

export async function POST(request) {
  const body = await request.json();
  const payload = {
    ...body,
    snippet: body.snippet ?? BASE_TOAST_SNIPPET,
  };

  await new Promise((resolve) => setTimeout(resolve, 120));

  return NextResponse.json({
    systemPrompt: SYSTEM_PROMPT,
    language: payload.targetLanguage,
    code: buildMorphCode(payload),
    telemetry: payload.workspaceState,
  });
}
