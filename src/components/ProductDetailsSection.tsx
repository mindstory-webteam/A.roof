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
// Spec table data
// ─────────────────────────────────────────────
const specs: { label: string; value: string | string[] }[] = [
  { label: 'Thickness', value: '2.8 - 3 mm' },
  { label: 'Length', value: ["7' 11\" / 12' 2\"", "2.41m / 3.71m"] },
  { label: 'Total Width', value: "1050mm (3'5\")" },
  { label: 'Gap Between Purlin', value: '26 Inches' },
  { label: 'Covering Width', value: "960mm (3'2\")" },
  { label: 'Layers', value: '3 layers' },
  { label: 'Coating', value: 'ASA' },
];

// ─────────────────────────────────────────────
// Main ProductDetailsSection — image left, content + spec table right
// ─────────────────────────────────────────────
const ProductDetailsSection: React.FC = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: imageRef.current, start: 'top bottom-=10%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll('.spec-row');
        gsap.fromTo(
          rows,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: tableRef.current, start: 'top bottom-=10%', toggleActions: 'play none none reverse' },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      style={{ fontFamily: "'Mulish', sans-serif" }}
      className="bg-white py-24 px-6 lg:px-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── LEFT: Sticky image ──────────────────────────────────── */}
        <div ref={imageRef} className="lg:sticky lg:top-28">
          <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #001e3c 0%, #003b7a 100%)' }}
            />
            <img
              src="/images/magnific_ultrarealistic-closeup-ar_jSh8pogLD0.png"
              alt="A-Roof ASA coated PVC roofing sheets being installed"
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>

        {/* ── RIGHT: Headings, descriptions + spec table ──────────── */}
        <div>
          {/* Intro heading */}
          <h2 className="text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold text-[#002c5b] leading-tight mb-4">
            A-Roof <span className="text-[#e8700a]">(ASA Coating)</span>
          </h2>

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
            A-Roof is a new range product by Aqua Star. (Ponnore Group) Keeping innovation at its core, the brand has successfully engraved a distinct space in the market within a very short span of time. It brings a new experience for those who want to venture into new technical products with a traditional look. A-Roof, offers you an aesthetic, efficient and high quality roofing sheets sheet.
          </ScrollReveal>

          {/* Divider */}
          <div className="w-12 h-[3px] bg-[#e8700a] rounded-full my-6" />

          {/* Description heading */}
          <h2 className="text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold text-[#002c5b] leading-tight mb-4">
            A-Roof Product Description
          </h2>

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
            A-Roof's sheet is ASA (Acrylonitrile Styrene Acrylate) coated PVC roofing sheet. The products are special 3 layer co-extruded PVC sheets. The top layer material is made with ASA anti-climate engineering resin, which is suitable for outdoor use. Even when exposed to ultra-violet radiation, dampness, heat, chillness and impact, the product retains the colour and other physical properties and has excellent anti-corrosive properties.
          </ScrollReveal>

          {/* Spec table */}
          <div ref={tableRef} className="mt-10 rounded-xl overflow-hidden border border-[#d6e4f5] shadow-sm">
            {/* Table header */}
            <div className="bg-[#1763ae] text-white text-center py-3.5 font-extrabold uppercase tracking-[0.18em] text-sm">
              Aroof Techo
            </div>

            {/* Table rows */}
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`spec-row grid grid-cols-2 ${i % 2 === 0 ? 'bg-white' : 'bg-[#f7f9fc]'} ${i !== specs.length - 1 ? 'border-b border-[#e3ecf7]' : ''}`}
              >
                <div className="flex items-center justify-center text-center font-bold text-[#002c5b] text-[13px] sm:text-[14px] px-4 py-4 border-r border-[#e3ecf7]">
                  {spec.label}
                </div>
                <div className="flex flex-col items-center justify-center text-center text-[#4a5568] text-[13px] sm:text-[14px] px-4 py-4 leading-[1.6]">
                  {Array.isArray(spec.value)
                    ? spec.value.map((line, idx) => <span key={idx}>{line}</span>)
                    : spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductDetailsSection;