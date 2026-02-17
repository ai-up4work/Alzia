'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
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

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    autoplayRef.current = setInterval(next, 3000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [next, isPaused]);

  return (
    <section className="max-w-5xl mx-auto mb-14 px-2">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Images className="w-5 h-5 text-purple-500" />
          <h2 className="font-serif text-xl font-light text-gray-900 tracking-wide">
            Demo Try-Ons
          </h2>
          <span className="ml-2 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-0.5">
            {total} results
          </span>
        </div>

        {/* Desktop nav arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm transition-colors"
            aria-label="Previous result"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm transition-colors"
            aria-label="Next result"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Carousel track */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-lg border border-gray-200 cursor-pointer"
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
              height={500} // 16:9 ratio
              className="w-full h-full object-cover"
              loading="lazy"
            />


              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Labels */}
              <div className="absolute bottom-4 left-4 right-16 z-20">
                {/* <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-white/80 bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-0.5 mb-1.5">
                  {item.tag}
                </span> */}
                <p className="text-white font-serif text-lg font-light leading-tight drop-shadow">
                  {item.label}
                </p>
              </div>

              {/* Slide counter badge */}
              <div className="absolute top-3 right-3 z-20 text-xs font-medium text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                {idx + 1} / {total}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile touch nav */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors sm:hidden"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 text-gray-800" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors sm:hidden"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 text-gray-800" />
        </button>
      </div>

      {/* Dot indicators + progress bar */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="flex items-center gap-2">
          {previousRenders.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? 'w-7 h-2 bg-purple-500'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Autoplay progress bar */}
        {!isPaused && (
          <div className="w-32 h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              key={current} // reset animation on slide change
              className="h-full bg-purple-400 rounded-full"
              style={{
                animation: 'progressBar 4s linear forwards',
              }}
            />
          </div>
        )}
      </div>

      {/* Inline keyframe for progress bar */}
      <style jsx>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}