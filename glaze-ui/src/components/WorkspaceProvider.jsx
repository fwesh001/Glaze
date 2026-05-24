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
    language: 'Select language',
    prompt: '',
    displayCode: '',
    animationTick: 0,
  };
}

function createToastEntry(message, tone = 'info') {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    tone,
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
  const [compilerBusy, setCompilerBusy] = useState(false);
  const [compilerToast, setCompilerToast] = useState(null);
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

  const setCompilerLoading = useCallback((nextBusy) => {
    setCompilerBusy(Boolean(nextBusy));
  }, []);

  const showCompilerToast = useCallback((message, tone = 'info') => {
    const entry = createToastEntry(message, tone);
    setCompilerToast(entry);
    return entry.id;
  }, []);

  const clearCompilerToast = useCallback(() => {
    setCompilerToast(null);
  }, []);

  const value = useMemo(
    () => ({
      registryItem,
      settings: workspaceState.settings,
      language: workspaceState.language,
      prompt: workspaceState.prompt,
      displayCode: workspaceState.displayCode,
      animationTick: workspaceState.animationTick,
      compilerBusy,
      compilerToast,
      setSetting,
      setLanguage,
      setPrompt,
      setDisplayCode,
      resetAnimation,
      setCompilerLoading,
      showCompilerToast,
      clearCompilerToast,
    }),
    [
      clearCompilerToast,
      compilerBusy,
      compilerToast,
      registryItem,
      resetAnimation,
      setCompilerLoading,
      setDisplayCode,
      setLanguage,
      setPrompt,
      setSetting,
      showCompilerToast,
      workspaceState,
    ],
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
