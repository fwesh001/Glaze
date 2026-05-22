'use client';

import { useEffect, useRef, useState } from 'react';

import gsap from 'gsap';
import { Activity, RefreshCw } from 'lucide-react';

import LiquidToast from '../library/toasts/liquid-toast/index.jsx';
import PaperReceiptToast from '../library/toasts/paper-receipt-toast/index.jsx';
import CountdownCapsuleToast from '../library/toasts/countdown-capsule/index.jsx';
import DepthStackerToast from '../library/toasts/depth-stacker/index.jsx';
import ParticleShatterToast from '../library/toasts/particle-shatter/index.jsx';
import RadialShockwaveToast from '../library/toasts/radial-shockwave/index.jsx';
import TelemetryTickerToast from '../library/toasts/telemetry-ticker/index.jsx';
import EdgeSnapperToast from '../library/toasts/edge-snapper/index.jsx';
import GlassmorphicLiquidModal from '../library/modals/glassmorphic-liquid-modal/index.jsx';
import PaperOrigamiModal from '../library/modals/paper-origami-modal/index.jsx';
import DecryptionBreachModal from '../library/modals/decryption-breach/index.jsx';
import ChamberDropModal from '../library/modals/chamber-drop/index.jsx';
import PrismRevealModal from '../library/modals/prism-reveal/index.jsx';
import SidebarDockModal from '../library/modals/sidebar-dock/index.jsx';
import SplitPaneModal from '../library/modals/split-pane/index.jsx';
import DepthInversionModal from '../library/modals/depth-inversion/index.jsx';
import GlassmorphicLiquidLoader from '../library/loaders/glassmorphic-liquid-loader/index.jsx';
import PaperFoldLoader from '../library/loaders/paper-fold-loader/index.jsx';
import BinaryStreamLoader from '../library/loaders/binary-stream/index.jsx';
import BezierWaveLoader from '../library/loaders/bezier-wave/index.jsx';
import QuantumGridLoader from '../library/loaders/quantum-grid/index.jsx';
import FibonacciSpiralLoader from '../library/loaders/fibonacci-spiral/index.jsx';
import MemoryBlocksLoader from '../library/loaders/memory-blocks/index.jsx';
import MercurySpillLoader from '../library/loaders/mercury-spill/index.jsx';
import { useWorkspace } from './WorkspaceProvider.jsx';

function ToastPreview({ registryItem, settings, previewKey }) {
  switch (registryItem?.id) {
    case 'paper-receipt-toast':
      return (
        <div key={previewKey} className="flex h-full items-center justify-center">
          <PaperReceiptToast
            message={settings?.message ?? 'Payment received'}
            tone={settings?.tone ?? 'Kraft'}
            speed={settings?.speed ?? 1}
            depth={settings?.depth ?? 14}
          />
        </div>
      );
    case 'countdown-capsule':
      return (
        <div key={previewKey} className="flex h-full items-center justify-center">
          <CountdownCapsuleToast
            message={settings?.message ?? 'Telemetry uplink active'}
            timer={settings?.timer ?? 4}
            speed={settings?.speed ?? 1}
            onAutoClose={() => {}}
          />
        </div>
      );
    case 'depth-stacker':
      return (
        <div key={previewKey} className="flex h-full items-center justify-center">
          <DepthStackerToast
            message={settings?.message ?? 'Depth focus lock acquired'}
            stack={settings?.stack ?? 4}
            speed={settings?.speed ?? 1}
          />
        </div>
      );
    case 'particle-shatter':
      return (
        <div key={previewKey} className="flex h-full items-center justify-center">
          <ParticleShatterToast
            message={settings?.message ?? 'Container integrity compromised'}
            speed={settings?.speed ?? 1}
          />
        </div>
      );
    case 'radial-shockwave':
      return (
        <div key={previewKey} className="flex h-full items-center justify-center">
          <RadialShockwaveToast
            message={settings?.message ?? 'Shockwave event registered'}
            speed={settings?.speed ?? 1}
          />
        </div>
      );
    case 'telemetry-ticker':
      return (
        <div key={previewKey} className="flex h-full items-center justify-center">
          <TelemetryTickerToast
            message={settings?.message ?? 'Diagnostic bus synchronized'}
            lines={settings?.lines ?? 4}
            speed={settings?.speed ?? 1}
          />
        </div>
      );
    case 'edge-snapper':
      return (
        <div key={previewKey} className="flex h-full items-center justify-center">
          <EdgeSnapperToast
            message={settings?.message ?? 'Boundary magnet active'}
            snapThreshold={settings?.snapThreshold ?? 70}
            speed={settings?.speed ?? 1}
          />
        </div>
      );
    default:
      return (
        <div key={previewKey} className="flex h-full items-center justify-center">
          <LiquidToast stackIndex={0} />
        </div>
      );
  }
}

function ModalPreview({ registryItem, settings, previewKey }) {
  const commonModalProps = {
    isOpen: true,
    isEmbedded: true,
    title: settings?.title ?? 'Confirm action',
    message: settings?.message ?? 'Proceed with this operation?',
    speed: settings?.speed ?? 1,
    onConfirm: () => {},
    onCancel: () => {},
    onClose: () => {},
  };

  switch (registryItem?.id) {
    case 'paper-origami-modal':
      return (
        <div key={previewKey} className="relative flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <PaperOrigamiModal
            isOpen={true}
            isEmbedded={true}
            title={settings?.title ?? 'Open document'}
            message={settings?.message ?? 'This paper fold can reveal any content.'}
            tone={settings?.tone ?? 'Ivory'}
            speed={settings?.speed ?? 1}
            shadow={settings?.shadow ?? 14}
          />
        </div>
      );
    case 'decryption-breach':
      return (
        <div key={previewKey} className="relative flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <DecryptionBreachModal {...commonModalProps} />
        </div>
      );
    case 'chamber-drop':
      return (
        <div key={previewKey} className="relative flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <ChamberDropModal {...commonModalProps} />
        </div>
      );
    case 'prism-reveal':
      return (
        <div key={previewKey} className="relative flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <PrismRevealModal {...commonModalProps} />
        </div>
      );
    case 'sidebar-dock':
      return (
        <div key={previewKey} className="relative flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <SidebarDockModal {...commonModalProps} />
        </div>
      );
    case 'split-pane':
      return (
        <div key={previewKey} className="relative flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <SplitPaneModal {...commonModalProps} />
        </div>
      );
    case 'depth-inversion':
      return (
        <div key={previewKey} className="relative flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <DepthInversionModal {...commonModalProps} />
        </div>
      );
    default:
      return (
        <div key={previewKey} className="relative flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <GlassmorphicLiquidModal
            isOpen={true}
            isEmbedded={true}
            title={settings?.title ?? 'Confirm action'}
            message={settings?.message ?? 'Are you sure?'}
            tone={settings?.tone ?? 'Neutral'}
            onConfirm={() => {}}
            onCancel={() => {}}
            onClose={() => {}}
          />
        </div>
      );
  }
}

function LoaderPreview({ registryItem, settings, previewKey }) {
  switch (registryItem?.id) {
    case 'paper-fold-loader':
      return (
        <div key={previewKey} className="flex h-full min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2rem]">
          <PaperFoldLoader
            isOpen={true}
            isEmbedded={true}
            message={settings?.message ?? 'Preparing the paper'}
            tone={settings?.tone ?? 'Parchment'}
            speed={settings?.speed ?? 1}
            thickness={settings?.thickness ?? 4}
          />
        </div>
      );
    case 'binary-stream':
      return (
        <div key={previewKey} className="flex h-full min-h-[28rem] w-full items-center justify-center">
          <BinaryStreamLoader />
        </div>
      );
    case 'bezier-wave':
      return (
        <div key={previewKey} className="flex h-full min-h-[28rem] w-full items-center justify-center">
          <BezierWaveLoader />
        </div>
      );
    case 'quantum-grid':
      return (
        <div key={previewKey} className="flex h-full min-h-[28rem] w-full items-center justify-center">
          <QuantumGridLoader />
        </div>
      );
    case 'fibonacci-spiral':
      return (
        <div key={previewKey} className="flex h-full min-h-[28rem] w-full items-center justify-center">
          <FibonacciSpiralLoader />
        </div>
      );
    case 'memory-blocks':
      return (
        <div key={previewKey} className="flex h-full min-h-[28rem] w-full items-center justify-center">
          <MemoryBlocksLoader />
        </div>
      );
    case 'mercury-spill':
      return (
        <div key={previewKey} className="flex h-full min-h-[28rem] w-full items-center justify-center">
          <MercurySpillLoader />
        </div>
      );
    default:
      return (
        <div key={previewKey} className="flex h-full min-h-[28rem] w-full items-center justify-center">
          <GlassmorphicLiquidLoader
            isOpen={true}
            isEmbedded={true}
            message={settings?.message ?? 'Loading your experience'}
            size={settings?.size ?? 112}
            speed={settings?.speed ?? 1}
          />
        </div>
      );
  }
}

export default function MercuryChamber() {
  const chamberRef = useRef(null);
  const glowRef = useRef(null);
  const overclockTimerRef = useRef(null);
  const [overclockNodes, setOverclockNodes] = useState([]);
  const { registryItem, settings, animationTick, resetAnimation } = useWorkspace();

  const hasToastPreview = registryItem?.category === 'toast';
  const previewKey = `${registryItem?.id ?? 'none'}:${animationTick}`;

  const createOverclockNodes = () => {
    const count = Math.floor(gsap.utils.random(30, 50, 1));

    return Array.from({ length: count }, (_, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      left: `${gsap.utils.random(4, 92)}%`,
      top: `${gsap.utils.random(6, 86)}%`,
      width: `${gsap.utils.random(220, 320)}px`,
      delay: index * 0.03 + gsap.utils.random(0, 0.12),
      initialOffset: {
        x: gsap.utils.random(-220, 220),
        y: gsap.utils.random(-160, 160),
      },
      viscosity: gsap.utils.random(0.75, 1.9),
    }));
  };

  const runOverclock = () => {
    const nodes = createOverclockNodes();
    setOverclockNodes(nodes);

    if (overclockTimerRef.current) {
      window.clearTimeout(overclockTimerRef.current);
    }

    overclockTimerRef.current = window.setTimeout(() => {
      setOverclockNodes([]);
    }, 7000);
  };

  useEffect(() => {
    const glow = glowRef.current;

    if (!glow) {
      return undefined;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline.fromTo(glow, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.55 });

    const mesh = gsap.to(chamberRef.current, {
      backgroundPosition: '100% 100%',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      timeline.kill();
      mesh.kill();
      if (overclockTimerRef.current) {
        window.clearTimeout(overclockTimerRef.current);
      }
    };
  }, [animationTick, registryItem]);

  return (
    <section
      ref={chamberRef}
      className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(52,211,255,0.08))] bg-[length:200%_200%] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-30px_60px_rgba(0,0,0,0.5),0_35px_100px_rgba(0,0,0,0.5)]"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,255,0.18),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_55%_85%,rgba(0,255,170,0.1),transparent_30%)]"
      />

      <div className="relative flex h-full min-h-[360px] items-center justify-center">
        <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
          {hasToastPreview ? (
            <div className="relative h-full w-full">
              <div className="absolute left-4 top-4 text-[0.65rem] uppercase tracking-[0.45em] text-cyan-300/80">Physics Grid</div>

              <div className="absolute inset-0">
                {overclockNodes.map((node, index) => (
                  <LiquidToast
                    key={node.id}
                    stackIndex={index}
                    positionClass="absolute"
                    className="absolute"
                    style={{ left: node.left, top: node.top, width: node.width }}
                    trajectory={node.initialOffset}
                    entranceDelay={node.delay}
                    physicsScale={node.viscosity}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative flex h-full w-full max-w-2xl flex-col gap-4">
          {registryItem?.category === 'toast' && overclockNodes.length === 0 ? (
            <ToastPreview registryItem={registryItem} settings={settings} previewKey={previewKey} />
          ) : registryItem?.category === 'modal' ? (
            <ModalPreview registryItem={registryItem} settings={settings} previewKey={previewKey} />
          ) : registryItem?.category === 'loader' ? (
            <LoaderPreview registryItem={registryItem} settings={settings} previewKey={previewKey} />
          ) : registryItem ? (
            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 text-sm text-zinc-400">
              No preview available for this component.
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 text-sm text-zinc-400">
              No component selected.
            </div>
          )}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <button
            type="button"
            onClick={runOverclock}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-cyan-200 shadow-[0_0_35px_rgba(52,211,255,0.12)] transition-transform hover:scale-105"
            aria-label="Run overclock stress test"
          >
            <Activity size={16} />
            Overclock
          </button>

          <button
            type="button"
            onClick={resetAnimation}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-transform hover:scale-105"
            aria-label="Reload component animation"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
