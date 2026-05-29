'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import supabase from '../../lib/supabase';

const GlazeAuthContext = createContext(null);

function normalizeUserMetadata(user) {
  return {
    avatar_url: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '',
    name: user?.user_metadata?.name || user?.user_metadata?.full_name || '',
    user_name:
      user?.user_metadata?.user_name || user?.user_metadata?.preferred_username || user?.user_metadata?.login || '',
  };
}

export function GlazeAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const migrateGuestPresets = async (activeUser) => {
    if (typeof window === 'undefined' || !activeUser?.id) {
      return;
    }

    const stored = window.localStorage.getItem('glaze_guest_presets');
    if (!stored) {
      return;
    }

    let presets = null;
    try {
      presets = JSON.parse(stored);
    } catch (error) {
      console.error('[GlazeAuth] Invalid guest preset payload:', error);
      return;
    }

    const presetsArray = Array.isArray(presets) ? presets : [presets];
    if (!presetsArray.length) {
      return;
    }

    const records = presetsArray
      .filter(Boolean)
      .map((preset) => ({
        author_id: activeUser.id,
        type: preset.type || 'M',
        title: preset.title || 'Migrated Guest Preset',
        physics_config: preset.physics_config || preset.settings || {},
        compiled_code: preset.compiled_code || preset.displayCode || '',
        is_public: preset.is_public ?? false,
      }));

    if (!records.length) {
      return;
    }

    const { error, status } = await supabase.from('glaze_components').insert(records);

    if (error) {
      console.error('[GlazeAuth] Failed to migrate guest presets:', error);
      return;
    }

    if (status === 200 || status === 201) {
      window.localStorage.removeItem('glaze_guest_presets');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const {
          data: { session: activeSession },
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        setSession(activeSession ?? null);
        setUser(activeSession?.user ?? null);

        if (activeSession?.user) {
          await migrateGuestPresets(activeSession.user);
        }
      } catch (error) {
        console.error('[GlazeAuth] Failed to initialize session:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await migrateGuestPresets(nextSession.user);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: redirectTo ? { redirectTo } : undefined,
    });

    if (error) {
      console.error('[GlazeAuth] GitHub login failed:', error);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[GlazeAuth] Logout failed:', error);
      return;
    }

    setUser(null);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
      avatarUrl: normalizeUserMetadata(user).avatar_url,
      displayName: normalizeUserMetadata(user).name || normalizeUserMetadata(user).user_name || 'Glaze Developer',
    }),
    [loading, user, session],
  );

  return <GlazeAuthContext.Provider value={value}>{children}</GlazeAuthContext.Provider>;
}

export function useGlazeAuth() {
  const context = useContext(GlazeAuthContext);

  if (!context) {
    throw new Error('useGlazeAuth must be used within a GlazeAuthProvider');
  }

  return context;
}
