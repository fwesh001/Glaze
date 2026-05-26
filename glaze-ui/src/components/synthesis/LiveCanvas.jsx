'use client';

import { useEffect, useMemo, useState, useRef } from 'react';

function IframeRunner({ code, physics }) {
  const iframeRef = useRef(null);

  // Clean raw imports/exports so UMD React & Babel can execute it cleanly
  const cleanedCode = useMemo(() => {
    if (!code) return '';
    return code
      .replace(/import\s+[\s\S]*?\s+from\s+['"].*?['"];?/g, '')
      .replace(/import\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '');
  }, [code]);

  // Extract the main component's name
  const componentName = useMemo(() => {
    if (!cleanedCode) return null;
    const match = cleanedCode.match(/(?:function|const|let)\s+([A-Z]\w+)/);
    return match ? match[1] : null;
  }, [cleanedCode]);

  // Build the sandboxed dynamic preview frame
  const srcDoc = useMemo(() => {
    if (!cleanedCode || !componentName) return '';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      background-color: transparent;
      margin: 0;
      padding: 16px;
      color: white;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 25rem;
      overflow: auto;
    }
    :root {
      --current-blur-prop: ${physics.blur}px;
      --viscosity: ${physics.viscosity};
      --mass: ${physics.mass};
      --workspace-blur: ${physics.blur}px;
    }
  </style>
</head>
<body>
  <div id="root" style="width: 100%;"></div>
  <div id="error-container" style="color: #f87171; font-family: monospace; font-size: 11px; white-space: pre-wrap; padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; width: 100%; display: none;"></div>

  <script>
    // Expose local module mocks
    window.exports = {};
    window.module = { exports: window.exports };
    window.require = function(name) {
      if (name === 'react') return window.React;
      if (name === 'react-dom') return window.ReactDOM;
      if (name === 'gsap') return window.gsap;
      return {};
    };
  </script>

  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;

    try {
      ${cleanedCode}

      // Hook component up to global scope
      window.${componentName} = ${componentName};

      if (window.${componentName}) {
        const Comp = window.${componentName};
        ReactDOM.createRoot(document.getElementById('root')).render(
          <Comp 
            viscosity={${physics.viscosity}}
            blur={${physics.blur}}
            mass={${physics.mass}}
          />
        );
      } else {
        throw new Error("Could not find a valid React component named '" + "${componentName}" + "'.");
      }
    } catch (e) {
      const errDiv = document.getElementById('error-container');
      errDiv.innerText = e.message + "\\n\\n" + e.stack;
      errDiv.style.display = 'block';
      document.getElementById('root').style.display = 'none';
    }
  </script>
</body>
</html>
    `;
  }, [cleanedCode, componentName, physics]);

  if (!srcDoc) {
    return (
      <div className="p-4 text-center text-xs text-zinc-400">
        Waiting for a valid component declaration (e.g. 'function Component() { ... }').
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      title="Live Preview Sandbox"
      className="w-full h-[28rem] border-0 bg-transparent"
      sandbox="allow-scripts"
    />
  );
}

export default function LiveCanvas({ code, physics, isProcessing }) {
  const hasCode = code && code.trim().length > 0 && !code.startsWith('// Processing');

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl h-full flex flex-col">
      <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">Live Canvas</div>
      <div className={`flex-1 min-h-[28rem] flex items-center justify-center rounded-xl border border-white/10 bg-black/40 p-4 ${isProcessing ? 'animate-pulse' : ''}`}>
        {isProcessing ? (
          <p className="text-center text-sm text-zinc-400">Rendering component...</p>
        ) : !hasCode ? (
          <p className="text-center text-sm text-zinc-400">Component preview</p>
        ) : (
          <IframeRunner code={code} physics={physics} />
        )}
      </div>
    </div>
  );
}
