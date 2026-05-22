'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const WorkspaceContext = createContext(null);

function buildInitialState(settingsConfig = []) {
  return settingsConfig.reduce((acc, setting) => {
    acc[setting.id] = setting.default ?? '';
    return acc;
  }, {});
}

export function WorkspaceProvider({ registryItem, children }) {
  const [settings, setSettings] = useState(() => buildInitialState(registryItem?.settingsConfig));
  const [animationTick, setAnimationTick] = useState(0);

  const value = useMemo(
    () => ({
      registryItem,
      settings,
      animationTick,
      setSetting: (settingId, valueToSet) => {
        setSettings((current) => ({ ...current, [settingId]: valueToSet }));
      },
      resetAnimation: () => setAnimationTick((current) => current + 1),
    }),
    [registryItem, settings, animationTick],
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
