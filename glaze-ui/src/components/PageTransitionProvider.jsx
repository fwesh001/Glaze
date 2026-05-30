'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlazeLoader from './ui/GlazeLoader';

const PageTransitionContext = createContext(null);

export function PageTransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsTransitioning(true);

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleStart);

    if (!router.__rawPush) {
      router.__rawPush = router.push;
    }
    if (!router.__rawReplace) {
      router.__rawReplace = router.replace;
    }

    router.push = function (...args) {
      handleStart();
      return router.__rawPush.apply(this, args);
    };

    router.replace = function (...args) {
      handleStart();
      return router.__rawReplace.apply(this, args);
    };

    return () => {
      window.removeEventListener('popstate', handleStart);
      router.push = router.__rawPush;
      router.replace = router.__rawReplace;
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
