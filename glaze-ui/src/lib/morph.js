export const BASE_TOAST_SNIPPET = `Glaze UI liquid toast scaffold reference.
Use this blueprint as the registry-linked component seed for future AI prompt injection.`;

export const TARGET_LANGUAGE_MAP = {
  'React (JSX)': 'jsx',
  Vue: 'markup',
  'Vanilla JS': 'javascript',
};

export function serializeMorphPayload({ language, settings, prompt, registryItem, snippet = BASE_TOAST_SNIPPET }) {
  return {
    targetLanguage: language,
    workspaceState: {
      message: settings?.message ?? '',
      viscosity: settings?.viscosity ?? 1,
      blur: settings?.blur ?? 20,
      glow: settings?.glow ?? 'Success Green',
    },
    registryMeta: registryItem
      ? {
          id: registryItem.id,
          name: registryItem.name,
          category: registryItem.category,
          directoryPath: registryItem.directoryPath,
        }
      : null,
    prompt,
    snippet,
  };
}

export function buildMorphCode(payload) {
  const { targetLanguage, workspaceState, prompt, snippet } = payload;
  const telemetryComment = prompt?.trim()
    ? `// AI prompt: ${prompt.trim().replace(/\n+/g, ' ')}`
    : '// AI prompt: none provided';

  if (targetLanguage === 'Vue') {
    return `${telemetryComment}
${snippet}

<script setup>
const props = defineProps({
  message: { type: String, default: '${workspaceState.message}' },
  viscosity: { type: Number, default: ${workspaceState.viscosity} },
  blur: { type: Number, default: ${workspaceState.blur} },
  glow: { type: String, default: '${workspaceState.glow}' },
});
</script>

<template>
  <div class="liquid-toast" :style="{ '--workspace-blur': '${workspaceState.blur}px' }">
    <div class="toast-body">
      <h3>{{ props.message }}</h3>
      <p>{{ props.viscosity }} · {{ props.glow }}</p>
    </div>
  </div>
</template>`;
  }

  if (targetLanguage === 'Vanilla JS') {
    return `${telemetryComment}
${snippet}

export function renderLiquidToast(host = document.body) {
  const node = document.createElement('div');
  node.className = 'liquid-toast';
  node.style.setProperty('--workspace-blur', '${workspaceState.blur}px');
  node.innerHTML = ` + "`" + `
    <div class="toast-body">
      <h3>${workspaceState.message}</h3>
      <p>Viscosity ${workspaceState.viscosity} · Glow ${workspaceState.glow}</p>
    </div>
  ` + "`" + `;
  host.appendChild(node);
  return node;
}`;
  }

  return `${telemetryComment}
${snippet}

import React from 'react';

export default function LiquidToast({
  message = '${workspaceState.message}',
  viscosity = ${workspaceState.viscosity},
  blur = ${workspaceState.blur},
  glow = '${workspaceState.glow}',
}) {
  return (
    <div
      className="liquid-toast"
      style={{ '--workspace-blur': '\${blur}px' }}
      data-glow={glow}
      data-viscosity={viscosity}
    >
      <div className="toast-body">
        <h3>{message}</h3>
        <p>Viscosity {viscosity} · Glow {glow}</p>
      </div>
    </div>
  );
}`;
}

export async function requestMorphCode(payload) {
  const response = await fetch('/api/morph', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error ?? 'Unable to morph code.';
    throw new Error(message);
  }

  return data;
}
