'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  Database,
  Edit2,
  Heart,
  History,
  Info,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Terminal,
  Trash2,
  User,
  X
} from 'lucide-react';
import gsap from 'gsap';

import { useGlazeAuth } from '../../components/auth/GlazeAuthProvider';
import Sidebar from '../../components/Sidebar';
import GlazeSiteModal from '../../components/ui/GlazeSiteModal';
import GlazeSiteToast from '../../components/ui/GlazeSiteToast';
import supabase from '../../lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading, logout, avatarUrl, displayName } = useGlazeAuth();

  // Profile data state
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null); // true, false, 'invalid', null
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Tab views state
  const [activeTab, setActiveTab] = useState('added'); // 'liked', 'added', 'suggestions'
  const [likedComponents, setLikedComponents] = useState([]);
  const [likedLoading, setLikedLoading] = useState(false);
  const [components, setComponents] = useState([]);
  const [componentsLoading, setComponentsLoading] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Anonymization / Deletion states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [confirmUsername, setConfirmUsername] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [siteModal, setSiteModal] = useState(null);
  const [siteToast, setSiteToast] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [logoutConfirmModal, setLogoutConfirmModal] = useState(false);

  const joinedDate = useMemo(() => {
    const value = user?.created_at;
    return value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';
  }, [user?.created_at]);

  useEffect(() => {
    if (!siteToast) return undefined;

    const timer = window.setTimeout(() => {
      setSiteToast(null);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [siteToast]);

  // Auth gate check
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch db profile record
  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('glaze_users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data && !error) {
        setProfile(data);
        setEditName(data.name || '');
        setEditUsername(data.username || '');
      }
    } catch (err) {
      console.error('[Profile] Failed to load user profile record:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  // Check username uniqueness
  useEffect(() => {
    if (!editUsername) {
      setUsernameAvailable(null);
      return;
    }

    if (editUsername.length < 3 || !/^[a-zA-Z0-9_-]+$/.test(editUsername)) {
      setUsernameAvailable('invalid');
      return;
    }

    if (editUsername === profile?.username) {
      setUsernameAvailable(true);
      return;
    }

    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('glaze_users')
          .select('id')
          .eq('username', editUsername)
          .neq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setUsernameAvailable(!data);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingUsername(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [editUsername, profile?.username, user?.id]);

  // Save profile edits
  const handleSaveProfile = async () => {
    if (usernameAvailable === false || usernameAvailable === 'invalid' || !editName.trim()) {
      return;
    }

    setUpdatingProfile(true);
    try {
      const { error: dbError } = await supabase
        .from('glaze_users')
        .update({ name: editName.trim(), username: editUsername.trim() })
        .eq('id', user.id);

      if (dbError) throw dbError;

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: editName.trim(),
          name: editName.trim(),
          user_name: editUsername.trim(),
          preferred_username: editUsername.trim()
        }
      });

      if (authError) throw authError;

      setProfile(prev => ({
        ...prev,
        name: editName.trim(),
        username: editUsername.trim()
      }));
      setEditMode(false);
    } catch (err) {
      console.error('[Profile] Save failed:', err);
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    if (profile) {
      setEditName(profile.name || '');
      setEditUsername(profile.username || '');
    }
    setEditMode(false);
  };

  // Fetch Added Components
  const fetchComponents = async () => {
    if (!user?.id) return;
    setComponentsLoading(true);
    try {
      const { data, error } = await supabase
        .from('glaze_components')
        .select('id, title, type, created_at, physics_config, compiled_code')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComponents(data ?? []);

      // Also get what items of these the user has liked
      const compIds = (data ?? []).map(c => c.id);
      if (compIds.length > 0) {
        const { data: favsData, error: favsError } = await supabase
          .from('glaze_favorites')
          .select('component_id')
          .eq('user_id', user.id)
          .in('component_id', compIds);

        if (!favsError && favsData) {
          setFavoritedIds(favsData.map(f => f.component_id));
        }
      }
    } catch (err) {
      console.error('[Profile] Failed to load components:', err);
    } finally {
      setComponentsLoading(false);
    }
  };

  // Fetch Liked Components
  const fetchFavorites = async () => {
    if (!user?.id) return;
    setLikedLoading(true);
    try {
      const { data, error } = await supabase
        .from('glaze_favorites')
        .select(`
          component_id,
          component:glaze_components (
            id,
            title,
            type,
            physics_config,
            compiled_code,
            created_at,
            author:glaze_users (
              username,
              name
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      const parsedFavs = (data ?? []).map(f => f.component).filter(Boolean);
      setLikedComponents(parsedFavs);
    } catch (err) {
      console.error('[Profile] Failed to load favorites:', err);
    } finally {
      setLikedLoading(false);
    }
  };

  // Fetch Logs
  const fetchLogs = async () => {
    if (!user?.id) return;
    setLogsLoading(true);
    try {
      const { data, error } = await supabase
        .from('glaze_interaction_logs')
        .select(`
          id,
          prompt_text,
          created_at,
          component:glaze_components (
            title,
            type
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data ?? []);
    } catch (err) {
      console.error('[Profile] Failed to load logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  // Dynamic fetcher on tab swap
  useEffect(() => {
    if (user?.id) {
      if (activeTab === 'added') fetchComponents();
      if (activeTab === 'liked') fetchFavorites();
      if (activeTab === 'suggestions') fetchLogs();
    }
  }, [activeTab, user?.id]);

  // Favorite toggle
  const handleToggleFavorite = async (componentId) => {
    const isFav = favoritedIds.includes(componentId);
    try {
      if (isFav) {
        const { error } = await supabase
          .from('glaze_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('component_id', componentId);
        if (error) throw error;
        setFavoritedIds(prev => prev.filter(id => id !== componentId));
        setSiteToast({
          message: 'Removed from Liked UI',
          icon: Heart,
        });
      } else {
        const { error } = await supabase
          .from('glaze_favorites')
          .insert({ user_id: user.id, component_id: componentId });
        if (error) throw error;
        setFavoritedIds(prev => [...prev, componentId]);
        setSiteToast({
          message: 'Added to Liked UI',
          icon: Heart,
        });
      }
    } catch (err) {
      console.error('[Profile] Favorite toggle failed:', err);
    }
  };

  // Unlike a component directly from Liked UI tab
  const handleUnlikeComponent = async (componentId) => {
    try {
      const { error } = await supabase
        .from('glaze_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('component_id', componentId);
      if (error) throw error;
      setLikedComponents(prev => prev.filter(c => c.id !== componentId));
    } catch (err) {
      console.error('[Profile] Unlike failed:', err);
    }
  };

  // Delete custom component
  const handleDeleteComponent = async (componentId) => {
    setDeleteConfirmModal({ componentId });
  };

  const handleConfirmDeleteComponent = async () => {
    if (!deleteConfirmModal?.componentId) return;
    try {
      const { error } = await supabase
        .from('glaze_components')
        .delete()
        .eq('id', deleteConfirmModal.componentId);
      if (error) throw error;
      setComponents(prev => prev.filter(c => c.id !== deleteConfirmModal.componentId));
      setSiteToast({ message: 'Component deleted', icon: 'success' });
      setDeleteConfirmModal(null);
    } catch (err) {
      console.error('[Profile] Delete failed:', err);
      setSiteToast({ message: 'Failed to delete component', icon: 'error' });
    }
  };

  // Logout handlers
  const handleLogout = () => {
    setLogoutConfirmModal(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutConfirmModal(false);
    await logout();
  };

  // Account Anonymize (Option B Scrubber Execution)
  const handleAnonymizeAccount = async () => {
    if (confirmUsername !== profile?.username) return;
    setDeleting(true);
    try {
      // 1. Invoke Postgres function via RPC
      const { error: rpcError } = await supabase.rpc('anonymize_user', { user_id: user.id });
      if (rpcError) throw rpcError;

      // 2. Perform global signOut (revokes GitHub OAuth session tokens & decouples client)
      await logout();

      setShowDeleteModal(false);
      router.replace('/');
    } catch (err) {
      console.error('[Profile] Anonymization transaction failed:', err);
      setSiteModal({
        title: 'Account Anonymization Failed',
        message: 'An error occurred during account anonymization. Please try again.',
        ctaLabel: 'Close',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Handle mock sandbox preset insert
  const handleInjectSandboxPresets = async () => {
    try {
      const samplePresets = [
        {
          type: 'M',
          title: 'Liquid Plasma Toast',
          physics_config: { viscosity: 1.25, blur: 24, glow: 'Neon Cyan' },
          compiled_code: 'export default function CustomToast() { return <div>Plasma Fluid</div> }'
        },
        {
          type: 'L',
          title: 'Quantum Refraction Loader',
          physics_config: { viscosity: 0.8, blur: 30, glow: 'Success Green' },
          compiled_code: 'export default function CustomLoader() { return <div>Quantum Loader</div> }'
        }
      ];
      window.localStorage.setItem('glaze_guest_presets', JSON.stringify(samplePresets));
      setSiteModal({
        title: 'Guest Presets Seeded',
        message: 'Mock guest presets were injected into localStorage. Log out and sign in again to trigger automatic DB migration.',
        ctaLabel: 'Close',
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            <span className="text-xs uppercase tracking-[0.35em]">Synchronizing Session</span>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <main data-glaze-root className="min-h-screen bg-black px-4 py-4 text-white lg:px-5 lg:py-5">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] gap-5 lg:min-h-[calc(100vh-2.5rem)]">
        {/* Left collapsable GSAP navigation sidebar */}
        <Sidebar />

        {/* Master Right Frame */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 pb-1">
          {/* Header Panel */}
          <header className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-5 shadow-glass backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                >
                  <ArrowLeft size={16} />
                </Link>
                <div>
                  <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">Command Center</div>
                  <h1 className="mt-1 text-2xl font-black tracking-[0.25em] text-white">User Command Deck</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'added') fetchComponents();
                    if (activeTab === 'liked') fetchFavorites();
                    if (activeTab === 'suggestions') fetchLogs();
                    fetchProfile();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-300 transition-colors hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  <RefreshCw size={13} />
                  Sync State
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-300 transition-colors hover:bg-red-500/15"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Asymmetrical Profile Grid: Left 35% Metadata, Right 65% Hub */}
          <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[0.35fr_0.65fr]">
            {/* Left 35%: Personal Metadata Card */}
            <div className="flex flex-col gap-5">
              <section className="rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-6 shadow-glass backdrop-blur-xl">
                <div className="flex flex-col items-center border-b border-white/5 pb-6 text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName || 'Developer profile'}
                        className="relative h-24 w-24 rounded-full border border-white/10 object-cover shadow-glass"
                      />
                    ) : (
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-3xl font-black text-cyan-300">
                        {displayName ? displayName[0].toUpperCase() : 'D'}
                      </div>
                    )}
                  </div>

                  {!editMode ? (
                    <>
                      <h2 className="text-xl font-bold tracking-wide text-white">{profile?.name || displayName}</h2>
                      <p className="mt-1 text-sm text-zinc-500">@{profile?.username || 'anonymous_dev'}</p>
                      <button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        <Edit2 size={12} />
                        Edit Profile
                      </button>
                    </>
                  ) : (
                    <div className="w-full space-y-4 pt-2">
                      <div className="text-left">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Display Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/40"
                          placeholder="Name"
                          disabled={updatingProfile}
                        />
                      </div>

                      <div className="text-left">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Username</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">@</span>
                          <input
                            type="text"
                            value={editUsername}
                            onChange={e => setEditUsername(e.target.value.toLowerCase().trim())}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 pl-8 pr-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/40"
                            placeholder="username"
                            disabled={updatingProfile}
                          />
                        </div>

                        {/* Availability Validation Feedback */}
                        <div className="mt-1.5 min-h-[1rem] text-[10px]">
                          {checkingUsername && (
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Loader2 size={10} className="animate-spin text-cyan-400" />
                              Verifying availability...
                            </span>
                          )}
                          {!checkingUsername && usernameAvailable === true && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check size={10} /> Username available
                            </span>
                          )}
                          {!checkingUsername && usernameAvailable === false && (
                            <span className="text-red-400 flex items-center gap-1">
                              <X size={10} /> Username already taken
                            </span>
                          )}
                          {!checkingUsername && usernameAvailable === 'invalid' && (
                            <span className="text-amber-400">
                              3+ alphanumeric characters, hyphens or underscores
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={updatingProfile || usernameAvailable === false || usernameAvailable === 'invalid' || !editName.trim()}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-cyan-200 disabled:opacity-50"
                        >
                          {updatingProfile ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={updatingProfile}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-zinc-300 transition-colors hover:bg-white/[0.08]"
                        >
                          <X size={12} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Read only info parameters */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/40 px-4 py-3">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Mail size={14} />
                      <span className="text-[10px] uppercase tracking-[0.25em]">Email</span>
                    </div>
                    <span className="text-xs text-white truncate max-w-[180px]">{user?.email || 'Unknown'}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/40 px-4 py-3">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Calendar size={14} />
                      <span className="text-[10px] uppercase tracking-[0.25em]">Initialized</span>
                    </div>
                    <span className="text-xs text-white">{joinedDate}</span>
                  </div>
                </div>
              </section>

              {/* Danger Zone Component */}
              <section className="rounded-[2.2rem] border border-red-500/20 bg-red-500/[0.02] p-6 shadow-glass backdrop-blur-xl">
                <h3 className="text-xs font-black uppercase tracking-[0.35em] text-red-400 flex items-center gap-2">
                  <AlertTriangle size={14} />
                  Danger Zone
                </h3>
                <p className="mt-3 text-[11px] leading-5 text-zinc-500">
                  Decouple your digital identity. Your structural UI contributions remain online, but personal info is wiped completely.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteStep(1);
                    setConfirmUsername('');
                    setShowDeleteModal(true);
                  }}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-red-300 transition-colors hover:bg-red-500/15"
                >
                  Delete Account
                </button>
              </section>

              {/* Sandbox Presets Bench */}
              <section className="rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-6 shadow-glass backdrop-blur-xl">
                <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300/80 flex items-center gap-2">
                  <Database size={14} />
                  Test Sandbox
                </h3>
                <p className="mt-2 text-[11px] leading-5 text-zinc-500">
                  Load dummy presets into localStorage to verify the automatic guest migration trigger on next sign in.
                </p>
                <button
                  type="button"
                  onClick={handleInjectSandboxPresets}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-cyan-200 transition-colors hover:bg-cyan-400/15"
                >
                  <Plus size={13} />
                  Inject Guest Presets
                </button>
              </section>
            </div>

            {/* Right 65%: Activity Matrix Hub */}
            <div className="flex flex-col gap-5">
              <section className="flex flex-col h-full rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-6 shadow-glass backdrop-blur-xl">
                {/* Hub Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  {[
                    { id: 'added', label: 'Added Components', icon: Database },
                    { id: 'liked', label: 'Liked UI', icon: Heart },
                    { id: 'suggestions', label: 'Suggestions Stream', icon: Terminal }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-200 ${
                          isActive
                            ? 'border-white bg-white text-black shadow-glass'
                            : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <Icon size={13} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Substate Viewports */}
                <div className="mt-6 flex-1 min-h-[30rem]">
                  {activeTab === 'added' && (
                    <div className="h-full">
                      {componentsLoading ? (
                        <div className="flex h-64 items-center justify-center text-zinc-500">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-400" />
                          Reading deployment logs
                        </div>
                      ) : components.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-zinc-500">
                          <Info size={24} className="mb-2 text-zinc-600" />
                          <p className="text-sm">No custom component variations created yet.</p>
                          <p className="mt-1 text-xs text-zinc-600">Save a variation inside the control deck settings pane to populate this log.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          {components.map(comp => {
                            const isLiked = favoritedIds.includes(comp.id);
                            return (
                              <article key={comp.id} className="relative group rounded-3xl border border-white/10 bg-black/40 p-5 shadow-glass">
                                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-cyan-300 uppercase">
                                      {comp.type}
                                    </span>
                                    <span className="text-[10px] text-zinc-500">
                                      {new Date(comp.created_at).toLocaleDateString()}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleFavorite(comp.id)}
                                      className={`h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.06] ${
                                        isLiked ? 'text-rose-400 border-rose-500/20' : 'text-zinc-500 hover:text-white'
                                      }`}
                                      title={isLiked ? 'Remove Favorite' : 'Favorite Component'}
                                    >
                                      <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteComponent(comp.id)}
                                      className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-zinc-500 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 transition-all"
                                      title="Delete Component"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="mt-3 truncate text-base font-bold text-white">{comp.title}</h4>
                                <pre className="mt-3 max-h-36 overflow-auto rounded-xl bg-black/80 p-3 font-mono text-[10px] leading-5 text-zinc-400 border border-white/5">
                                  {JSON.stringify(comp.physics_config, null, 2)}
                                </pre>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'liked' && (
                    <div className="h-full">
                      {likedLoading ? (
                        <div className="flex h-64 items-center justify-center text-zinc-500">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-400" />
                          Reading favorites map
                        </div>
                      ) : likedComponents.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-zinc-500">
                          <Heart size={24} className="mb-2 text-zinc-600" />
                          <p className="text-sm">No favorited components yet.</p>
                          <p className="mt-1 text-xs text-zinc-600">Like components from your added list to populate this dashboard.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          {likedComponents.map(comp => (
                            <article key={comp.id} className="relative group rounded-3xl border border-white/10 bg-black/40 p-5 shadow-glass">
                              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-cyan-300 uppercase">
                                    {comp.type}
                                  </span>
                                  <span className="text-[10px] text-zinc-500">
                                    by @{comp.author?.username || 'anonymous'}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleUnlikeComponent(comp.id)}
                                  className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 transition-all hover:bg-rose-500/15"
                                  title="Unlike"
                                >
                                  <Heart size={14} fill="currentColor" />
                                </button>
                              </div>

                              <h4 className="mt-3 truncate text-base font-bold text-white">{comp.title}</h4>
                              <pre className="mt-3 max-h-36 overflow-auto rounded-xl bg-black/80 p-3 font-mono text-[10px] leading-5 text-zinc-400 border border-white/5">
                                {JSON.stringify(comp.physics_config, null, 2)}
                              </pre>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'suggestions' && (
                    <div className="h-full">
                      {logsLoading ? (
                        <div className="flex h-64 items-center justify-center text-zinc-500">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-400" />
                          Reading suggestions stream
                        </div>
                      ) : logs.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-zinc-500">
                          <Terminal size={24} className="mb-2 text-zinc-600" />
                          <p className="text-sm">Suggestions stream is empty.</p>
                          <p className="mt-1 text-xs text-zinc-600">Run code mutations via the AI Prompt Console to stream prompts here.</p>
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-white/10 bg-[#07070a] p-5 font-mono text-xs leading-6 text-zinc-400 shadow-glass">
                          <div className="mb-4 border-b border-white/5 pb-2 text-[0.65rem] uppercase tracking-widest text-zinc-600">
                            Suggestions Matrix Stream
                          </div>
                          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin">
                            {logs.map(log => (
                              <div key={log.id} className="flex flex-col gap-1 border-b border-white/[0.02] pb-3 last:border-0 last:pb-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-emerald-400">dev@glaze:~$</span>
                                  <span className="text-zinc-500 text-[10px]">
                                    [{new Date(log.created_at).toLocaleString()}]
                                  </span>
                                  <span className="rounded bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 uppercase tracking-wider">
                                    {log.component?.title || 'Component Canvas'} ({log.component?.type || '?'})
                                  </span>
                                </div>
                                <div className="pl-4 text-cyan-200 text-sm whitespace-pre-wrap break-words">
                                  &gt; {log.prompt_text}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {siteModal ? (
        <GlazeSiteModal
          title={siteModal.title}
          message={siteModal.message}
          ctaLabel={siteModal.ctaLabel || 'Close'}
          onConfirm={() => setSiteModal(null)}
          onClose={() => setSiteModal(null)}
        />
      ) : null}

      {deleteConfirmModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[2.5rem] border border-red-500/20 bg-gradient-to-br from-zinc-950 via-zinc-950 to-red-950/20 p-6 shadow-glass m-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-base font-black uppercase tracking-[0.35em] text-red-400 flex items-center gap-2">
                <AlertTriangle size={18} />
                Delete Component
              </h3>
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <p className="text-sm leading-6 text-zinc-300">
                Are you sure you want to delete this custom component from your profile?
              </p>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-5 text-red-300">
                This action is permanent and cannot be undone.
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteComponent}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white hover:bg-red-500"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {siteToast ? (
        <GlazeSiteToast
          message={siteToast.message}
          icon={siteToast.icon}
          onDismiss={() => setSiteToast(null)}
        />
      ) : null}

      {/* Delete / Anonymize Account Multi-Step Warning Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[2.5rem] border border-red-500/20 bg-gradient-to-br from-zinc-950 via-zinc-950 to-red-950/20 p-6 shadow-glass m-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-base font-black uppercase tracking-[0.35em] text-red-400 flex items-center gap-2">
                <AlertTriangle size={18} />
                Confirm Account Deletion
              </h3>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Steps */}
            <div className="mt-6 min-h-[12rem]">
              {deleteStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm leading-6 text-zinc-300">
                    You are initiating the **Ghost Legacy Anonymization** sequence for your account.
                  </p>
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-5 text-red-300">
                    <strong>Critical Information:</strong> All identifying profile values (name, email, github metadata) will be scrubbed and replaced with randomized placeholders.
                  </div>
                  <p className="text-xs text-zinc-500">
                    This step decouples your live social profile. Click Next to proceed to the database sync confirmation.
                  </p>
                </div>
              )}

              {deleteStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm leading-6 text-zinc-300">
                    To keep public community links stable, your **customized UI designs and presets** will not be deleted.
                  </p>
                  <div className="rounded-2xl border border-white/10 bg-black/60 p-4 text-xs leading-5 text-zinc-400">
                    Your username will instantly be released back to the global pool, and your contributions will be credited to a generic placeholder (e.g., <em>glaze_ghost_4a9b</em>).
                  </div>
                  <p className="text-xs text-zinc-500">
                    Your active OAuth connection tokens will be revoked instantly upon execution.
                  </p>
                </div>
              )}

              {deleteStep === 3 && (
                <div className="space-y-4">
                  <p className="text-sm leading-6 text-zinc-300">
                    Please confirm deletion by typing your current username (<em>{profile?.username}</em>) below:
                  </p>
                  <input
                    type="text"
                    value={confirmUsername}
                    onChange={e => setConfirmUsername(e.target.value.toLowerCase().trim())}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-red-400/40"
                    placeholder="Type username to confirm"
                    disabled={deleting}
                  />
                  <p className="text-xs text-red-400/80 flex items-center gap-1.5">
                    <Info size={12} /> This transaction cannot be undone.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Navigation */}
            <div className="mt-6 flex justify-end gap-3 border-t border-white/5 pt-4">
              {deleteStep > 1 && (
                <button
                  type="button"
                  onClick={() => setDeleteStep(prev => prev - 1)}
                  disabled={deleting}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 hover:text-white"
                >
                  Back
                </button>
              )}

              {deleteStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setDeleteStep(prev => prev + 1)}
                  className="rounded-xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-black hover:bg-cyan-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAnonymizeAccount}
                  disabled={deleting || confirmUsername !== profile?.username}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Execute Ghosting
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
