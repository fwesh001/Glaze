'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const WorkspaceContext = createContext(null);
const STORAGE_PREFIX = 'glaze-ui:workspace:';

function buildInitialState(settingsConfig = []) {
  return settingsConfig.reduce((acc, setting) => {
    acc[setting.id] = setting.default ?? '';
    return acc;
  }, {});
}

function buildDefaultWorkspace(registryItem) {
  return {
    settings: buildInitialState(registryItem?.settingsConfig),
    language: 'React (JSX)',
    prompt: '',
    displayCode: '',
    animationTick: 0,
  };
}

function getStorageKey(registryItem) {
  return registryItem?.id ? `${STORAGE_PREFIX}${registryItem.id}` : null;
}

function readPersistedWorkspace(registryItem) {
  const fallback = buildDefaultWorkspace(registryItem);

  if (typeof window === 'undefined') {
    return fallback;
  }

  const storageKey = getStorageKey(registryItem);

  if (!storageKey) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return fallback;
    }

    const parsed = JSON.parse(rawValue);

    return {
      ...fallback,
      ...parsed,
      settings: {
        ...fallback.settings,
        ...(parsed.settings ?? {}),
      },
    };
  } catch {
    return fallback;
  }
}

export function WorkspaceProvider({ registryItem, children }) {
  const [workspaceState, setWorkspaceState] = useState(() => readPersistedWorkspace(registryItem));
  const registryId = registryItem?.id;

  useEffect(() => {
    setWorkspaceState(readPersistedWorkspace(registryItem));
  }, [registryId]);

  useEffect(() => {
    const storageKey = getStorageKey(registryItem);

    if (!storageKey || typeof window === 'undefined') {
      return undefined;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(workspaceState));

    return undefined;
  }, [registryId, workspaceState]);

  const setSetting = useCallback((settingId, valueToSet) => {
    setWorkspaceState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [settingId]: valueToSet,
      },
    }));
  }, []);

  const setLanguage = useCallback((language) => {
    setWorkspaceState((current) => ({ ...current, language }));
  }, []);

  const setPrompt = useCallback((prompt) => {
    setWorkspaceState((current) => ({ ...current, prompt }));
  }, []);

  const setDisplayCode = useCallback((displayCode) => {
    setWorkspaceState((current) => ({ ...current, displayCode }));
  }, []);

  const resetAnimation = useCallback(() => {
    setWorkspaceState((current) => ({
      ...current,
      animationTick: current.animationTick + 1,
    }));
  }, []);

  const value = useMemo(
    () => ({
      registryItem,
      settings: workspaceState.settings,
      language: workspaceState.language,
      prompt: workspaceState.prompt,
      displayCode: workspaceState.displayCode,
      animationTick: workspaceState.animationTick,
      setSetting,
      setLanguage,
      setPrompt,
      setDisplayCode,
      resetAnimation,
    }),
    [registryItem, resetAnimation, setDisplayCode, setLanguage, setPrompt, setSetting, workspaceState],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  return context;
}

export function createWorkspaceDefaults(registryItem) {
  return buildInitialState(registryItem?.settingsConfig);
}
