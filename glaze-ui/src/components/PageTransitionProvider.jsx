'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlazeLoader from './ui/GlazeLoader';

const PageTransitionContext = createContext(null);

export function PageTransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Router events are not directly exposed in Next.js 13+ app router,
    // so we use a custom approach with route changes via navigation
    const handleStart = () => setIsTransitioning(true);
    const handleComplete = () => setIsTransitioning(false);

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleStart);

    // We'll set a small delay before hiding to ensure smooth transition
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = function (...args) {
      handleStart();
      return originalPush.apply(this, args);
    };

    router.replace = function (...args) {
      handleStart();
      return originalReplace.apply(this, args);
    };

    return () => {
      window.removeEventListener('popstate', handleStart);
    };
  }, [router]);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, setIsTransitioning }}>
      {children}
      {isTransitioning && <PageTransitionOverlay onComplete={() => setIsTransitioning(false)} />}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within PageTransitionProvider');
  }
  return context;
}

function PageTransitionOverlay({ onComplete }) {
  useEffect(() => {
    // Auto-hide loader after navigation completes (next tick)
    const timer = requestAnimationFrame(() => {
      // Wait for the page to actually render
      setTimeout(() => {
        onComplete();
      }, 100);
    });

    return () => cancelAnimationFrame(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <GlazeLoader />
    </div>
  );
}
