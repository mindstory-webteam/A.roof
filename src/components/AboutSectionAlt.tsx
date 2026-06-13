"use client"

import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// ScrollReveal component (unchanged from original)
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
// Feature data
// ─────────────────────────────────────────────
const features = [
  {
    title: 'UV-Stabilised Surface',
    desc: 'ASA polymer layer that resists fading and degradation over time.',
    icon: 'sun',
  },
  {
    title: 'All-Weather Build',
    desc: 'Engineered to withstand hail, high wind and extreme temperatures.',
    icon: 'shield',
  },
  {
    title: '12+ Colour Variants',
    desc: 'A finish to match every roofline, mood and design palette.',
    icon: 'palette',
  },
  {
    title: '25-Year Guarantee',
    desc: 'Long-term durability backed by our product warranty.',
    icon: 'badge',
  },
];

// ─────────────────────────────────────────────
// Minimal inline icon set (no external icon deps)
// ─────────────────────────────────────────────
const FeatureIcon: React.FC<{ type: string }> = ({ type }) => {
  const common = 'w-5 h-5';
  switch (type) {
    case 'sun':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'palette':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.2A4.3 4.3 0 0 0 21 12 9 9 0 0 0 12 3z" />
          <circle cx="7.5" cy="11.5" r="1" fill="currentColor" />
          <circle cx="9.5" cy="7.5" r="1" fill="currentColor" />
          <circle cx="14.5" cy="7.5" r="1" fill="currentColor" />
          <circle cx="16.5" cy="11.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'badge':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" />
          <path d="M8.5 12.5L7 21l5-2 5 2-1.5-8.5" />
        </svg>
      );
    default:
      return null;
  }
};

// ─────────────────────────────────────────────
// Main AboutSection — text left, floating image right
// ─────────────────────────────────────────────
const AboutSection: React.FC = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const statCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.92, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: imageRef.current, start: 'top bottom-=10%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (statCardRef.current) {
        gsap.fromTo(
          statCardRef.current,
          { opacity: 0, x: -24, y: 24 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: { trigger: statCardRef.current, start: 'top bottom-=5%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.5, rotate: -25 },
          {
            opacity: 1,
            scale: 1,
            rotate: -8,
            duration: 0.7,
            delay: 0.5,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: badgeRef.current, start: 'top bottom', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll('.feature-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger: featuresRef.current, start: 'top bottom-=15%', toggleActions: 'play none none reverse' },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      style={{ fontFamily: "'Mulish', sans-serif" }}
      className="bg-[#f7f9fc] py-24 px-6 lg:px-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

        {/* ── LEFT: Text content ──────────────────────────────────── */}
        <div>
          {/* Eyebrow tag */}
          <span className="inline-block bg-[#e8f0fb] text-[#002c5b] text-[11px] font-bold tracking-[0.14em] uppercase px-4 py-1.5 rounded mb-5">
            Welcome to
          </span>

          {/* Heading */}
          <h2 className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-extrabold text-[#002c5b] leading-tight mb-2">
            A-Roof{' '}
            <span className="text-[#e8700a]">(ASA Coating)</span>
          </h2>

          {/* ScrollReveal paragraph */}
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

          {/* Feature grid (2x2) */}
          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((feat, i) => (
              <div
                key={i}
                className="feature-item bg-white border border-[#d6e4f5]/70 rounded-xl p-4"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#e8f0fb] text-[#002c5b] mb-3">
                  <FeatureIcon type={feat.icon} />
                </span>
                <h3 className="text-[13px] font-bold text-[#002c5b] mb-1">
                  {feat.title}
                </h3>
                <p className="text-[12.5px] text-[#7a8ca0] leading-[1.6]">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-[#002c5b] hover:bg-[#003d7a] active:scale-[0.98] text-white font-bold text-[13px] tracking-widest uppercase px-8 py-3.5 rounded-md transition-all">
              Explore Products &nbsp;→
            </button>
            <a
              href="#"
              className="text-[#002c5b] font-bold text-[13px] tracking-widest uppercase underline underline-offset-4 hover:text-[#e8700a] transition-colors"
            >
              Download Brochure
            </a>
          </div>
        </div>

        {/* ── RIGHT: Floating image composition ───────────────────── */}
        <div className="relative pt-6 pb-10 lg:pt-10 lg:pb-14">

          {/* Decorative blurred shape behind image */}
          <div
            className="absolute -top-8 -right-10 w-56 h-56 rounded-full opacity-60 blur-3xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #e8f0fb 0%, #ffd9b8 100%)' }}
          />

          {/* Main image */}
          <div
            ref={imageRef}
            className="relative w-full aspect-[4/5] sm:aspect-[5/4] rounded-2xl overflow-hidden shadow-xl"
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #001e3c 0%, #003b7a 100%)' }}
            />
            <img
              src="/prodect/1 (1).png"
              alt="A-Roof ASA coated roofing sheet"
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002c5b]/50 via-transparent to-transparent" />
          </div>

          {/* Floating stat card */}
          <div
            ref={statCardRef}
            className="absolute -bottom-2 left-2 sm:-left-6 bg-white rounded-xl shadow-lg px-5 py-4 flex items-center gap-4"
          >
            <span className="text-[26px] font-extrabold text-[#002c5b] leading-none">50K+</span>
            <span className="text-[11px] text-[#7a8ca0] font-semibold uppercase tracking-wide leading-[1.4] max-w-[80px]">
              Roofs Installed Nationwide
            </span>
          </div>

          {/* Floating warranty badge */}
          <div
            ref={badgeRef}
            className="absolute -top-2 -right-2 sm:right-4 w-24 h-24 rounded-full bg-[#e8700a] text-white flex flex-col items-center justify-center text-center shadow-lg"
          >
            <span className="text-[20px] font-extrabold leading-none">25</span>
            <span className="text-[9px] font-bold uppercase tracking-wider leading-tight mt-1">
              Years<br />Warranty
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;