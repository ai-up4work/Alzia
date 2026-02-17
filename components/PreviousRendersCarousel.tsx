'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

// ─────────────────────────────────────────────
// 🖼️  REPLACE these with your real Cloudinary URLs
// Each entry is a combined (side-by-side) result image
// ─────────────────────────────────────────────
const previousRenders = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771309705/Alzia/job-1771309645079/combined.png',
    label: 'Saree Try-On',
    tag: 'Ethnic Wear',
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771267471/Alzia/job-1771267378994/combined.png',
    label: 'Fit Try-On',
    tag: 'Modest Wear',
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771260930/Alzia/job-1771260870221/combined.png',
    label: 'Abaya Try-On',
    tag: 'Formal',
  },
  {
    id: 4,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771218714/Alzia/job-1771218710373/combined.png',
    label: 'Hijab Try-On',
    tag: 'Kids',
  },
  {
    id: 5,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771217498/Alzia/job-1771217494961/combined.png',
    label: 'Casual Try-On',
    tag: 'Casual',
  },
];

export function PreviousRendersCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const total = previousRenders.length;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    autoplayRef.current = setInterval(next, 3000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [next, isPaused]);

  return (
    <section className="max-w-5xl mx-auto mb-14 px-2">

      {/* ── Section heading ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Icon pill */}
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-md shadow-purple-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <h2 className="font-serif text-xl font-light text-gray-900 tracking-wide">
            Demo Try-Ons
          </h2>

          {/* Count badge */}
          <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-0.5 tracking-wide">
            {total} looks
          </span>
        </div>

        {/* Desktop nav arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={prev}
            className="group w-9 h-9 rounded-xl border border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50 flex items-center justify-center shadow-sm transition-all duration-200"
            aria-label="Previous result"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
          </button>
          <button
            onClick={next}
            className="group w-9 h-9 rounded-xl border border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50 flex items-center justify-center shadow-sm transition-all duration-200"
            aria-label="Next result"
          >
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* ── Carousel track ── */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-xl shadow-gray-200/80 border border-gray-100 cursor-pointer ring-1 ring-black/5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        <div className="relative aspect-[16/9] sm:aspect-[2/1]">
          {previousRenders.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={item.url}
                alt={item.label}
                width={800}
                height={500}
                className="w-full h-full object-contain"
                loading="lazy"
              />

              {/* Multi-stop gradient for legible labels */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* ── Bottom label bar ── */}
              <div className="absolute bottom-0 left-0 right-0 z-20 px-5 py-4 flex items-end justify-between gap-3">
                <div>
                  {/* Tag chip */}
                  <span className="inline-block mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/70 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-0.5">
                    {item.tag}
                  </span>
                  <p className="text-white font-serif text-lg font-light leading-tight drop-shadow">
                    {item.label}
                  </p>
                </div>

                {/* Slide counter pill — bottom-right */}
                <span className="shrink-0 text-[11px] font-medium text-white/75 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1 leading-none">
                  {idx + 1}&thinsp;/&thinsp;{total}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile touch nav */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/90 hover:bg-white rounded-xl shadow-md transition-all sm:hidden border border-white/60"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/90 hover:bg-white rounded-xl shadow-md transition-all sm:hidden border border-white/60"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* ── Dots + progress ── */}
      <div className="flex flex-col items-center gap-3 mt-5">
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {previousRenders.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? 'w-6 h-2 bg-gradient-to-r from-purple-500 to-violet-500 shadow-sm shadow-purple-300'
                  : 'w-2 h-2 bg-gray-200 hover:bg-purple-300'
              }`}
            />
          ))}
        </div>

        {/* Autoplay progress bar */}
        {!isPaused && (
          <div className="w-28 h-px bg-gray-200 rounded-full overflow-hidden">
            <div
              key={current}
              className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full"
              style={{ animation: 'progressBar 3s linear forwards' }}
            />
          </div>
        )}
      </div>

      {/* Inline keyframe */}
      <style jsx>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}