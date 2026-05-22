'use client';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardGrid({ items = [], onSelect = () => {} }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  cardRefs.current = [];

  const setCardRef = (element) => {
    if (element && !cardRefs.current.includes(element)) {
      cardRefs.current.push(element);
    }
  };

  useEffect(() => {
    const cards = cardRefs.current;

    if (!cards.length) {
      return undefined;
    }

    gsap.set(cards, {
      transformPerspective: 1000,
      transformStyle: 'preserve-3d',
      opacity: 0,
      y: 22,
    });

    const animation = gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [items]);

  const handleMouseMove = (event, card) => {
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateY = ((x / bounds.width) - 0.5) * 10;
    const rotateX = ((0.5 - y / bounds.height) * 10);

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.01,
      boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 18px 50px rgba(52, 211, 255, 0.16)',
      duration: 0.18,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseEnter = (card) => {
    gsap.to(card, {
      boxShadow: '0 0 0 1px rgba(255,255,255,0.14), 0 0 45px rgba(52, 211, 255, 0.2)',
      duration: 0.2,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = (card) => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0, 0, 0, 0.35)',
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  return (
    <section ref={containerRef} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.id}
          ref={setCardRef}
          type="button"
          onClick={() => onSelect(item)}
          onMouseEnter={(event) => handleMouseEnter(event.currentTarget)}
          onMouseMove={(event) => handleMouseMove(event, event.currentTarget)}
          onMouseLeave={(event) => handleMouseLeave(event.currentTarget)}
          className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition-colors duration-200 hover:bg-white/[0.05]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">{item.category}</div>
            <div className="rounded-full border border-white/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-zinc-500">
              live
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">{item.name}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
        </button>
      ))}
    </section>
  );
}
