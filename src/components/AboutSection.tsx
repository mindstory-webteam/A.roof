"use client"

import React, { useEffect, useRef, useMemo, useState, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// ScrollReveal component (exact original logic)
// ─────────────────────────────────────────────
interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: { trigger: el, scroller, start: 'top bottom', end: rotationEnd, scrub: true },
      }
    );

    const wordElements = el.querySelectorAll<HTMLElement>('.word');
    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`leading-[1.5] font-semibold ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

// ─────────────────────────────────────────────
// Slide data – replace img paths with your own
// ─────────────────────────────────────────────
const slides = [
  { label: 'ASA Coating Technology',    img: '/prodect/1 (1).png' },
  { label: 'Weather-Resistant Profile', img: '/prodect/1 (1).png' },
  { label: '360° UV Protection',        img: '/prodect/1 (1).png' },
  { label: 'Proven Market Performance', img: '/prodect/1 (1).png' },
];

// ─────────────────────────────────────────────
// Single image card that slides in from the left
// ─────────────────────────────────────────────
interface ImageCardProps {
  slide: typeof slides[number];
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ slide, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { x: '-110%', opacity: 0 },
      {
        x: '0%',
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=10%',
          end: 'top center',
          scrub: 0.8,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Alternate slight vertical offset for visual rhythm
  const offsetClass = index % 2 === 0 ? 'ml-0' : 'ml-6';

  return (
    <div
      ref={cardRef}
      className={`relative w-full overflow-hidden rounded-xl shadow-lg ${offsetClass}`}
      style={{ height: '120px' }} // wide landscape, short height
    >
      {/* Fallback gradient bg if image fails to load */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #001e3c 0%, #003b7a 100%)' }}
      />
      <img
        src={slide.img}
        alt={slide.label}
        className="absolute inset-0 w-full h-full object-cover"
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#002c5b]/70 via-[#002c5b]/30 to-transparent" />

      {/* Label pill */}
      <div className="absolute left-4 bottom-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e8700a] flex-shrink-0" />
        <span
          style={{ fontFamily: "'Mulish', sans-serif" }}
          className="text-white text-[11px] font-semibold tracking-widest uppercase opacity-90"
        >
          {slide.label}
        </span>
      </div>

      {/* Slide number */}
      <span
        style={{ fontFamily: "'Mulish', sans-serif" }}
        className="absolute right-4 top-3 text-white/30 text-[11px] font-bold tabular-nums"
      >
        0{slides.indexOf(slide) + 1}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main AboutSection
// ─────────────────────────────────────────────
const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      style={{ fontFamily: "'Mulish', sans-serif" }}
      className="bg-[#f7f9fc] py-24 px-6 lg:px-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── LEFT: Stacked image cards ───────────────────────────── */}
        <div className="flex flex-col gap-4 pt-2">
          {slides.map((slide, i) => (
            <ImageCard key={i} slide={slide} index={i} />
          ))}
        </div>

        {/* ── RIGHT: Text content ─────────────────────────────────── */}
        <div className="lg:sticky lg:top-28 pt-2">

          {/* Eyebrow tag */}
          <span className="inline-block bg-[#e8f0fb] text-[#002c5b] text-[11px] font-bold tracking-[0.14em] uppercase px-4 py-1.5 rounded mb-5">
            Welcome to
          </span>

          {/* Heading */}
          <h2
            className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-extrabold text-[#002c5b] leading-tight mb-2"
          >
            A-Roof{' '}
            <span className="text-[#e8700a]">(ASA Coating)</span>
          </h2>

          {/* ── ScrollReveal paragraph ── */}
          <ScrollReveal
            baseOpacity={0.08}
            baseRotation={3}
            blurStrength={5}
            enableBlur={true}
            rotationEnd="bottom center"
            wordAnimationEnd="bottom center"
            containerClassName="!my-0"
            textClassName="!text-[15px] !font-normal text-[#4a5568] leading-[1.85]"
          >
            A-Roof is an innovative product by Aqua Star (Ponnore Group). Keeping innovation at its core, the brand has successfully engraved a distinct space in the market within a very short span of time.
          </ScrollReveal>

          {/* Divider */}
          <div className="w-12 h-[3px] bg-[#e8700a] rounded-full my-6" />

          {/* Feature bullets */}
          <ul className="space-y-3 mb-8">
            {[
              'UV-stabilised ASA polymer surface layer',
              'Resistant to hail, wind and extreme temperature',
              'Available in 12+ colour variants',
              '25-year product durability guarantee',
            ].map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-[#4a5568]">
                <span className="mt-1 w-4 h-4 rounded-full bg-[#e8f0fb] flex-shrink-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#002c5b]" />
                </span>
                {feat}
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { num: '25+',  label: 'Years of trust'    },
              { num: '50K+', label: 'Roofs installed'   },
              { num: '12',   label: 'Product variants'  },
            ].map(s => (
              <div
                key={s.label}
                className="bg-white border border-[#d6e4f5]/70 rounded-xl py-4 px-3 text-center"
              >
                <span className="block text-[22px] font-extrabold text-[#002c5b]">{s.num}</span>
                <span className="block text-[11px] text-[#7a8ca0] font-semibold uppercase tracking-wide mt-1">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="bg-[#002c5b] hover:bg-[#003d7a] active:scale-[0.98] text-white font-bold text-[13px] tracking-widest uppercase px-8 py-3.5 rounded-md transition-all">
            Explore Products &nbsp;→
          </button>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;