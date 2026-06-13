"use client";

import React, { useEffect, useRef, useMemo, useState, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// ScrollReveal — word-by-word blur/opacity/rotation
// reveal on scroll (same effect as BlogSection).
// Inline-style based, hooks into the CSS classes
// defined in the <style> block below via `className`.
// ─────────────────────────────────────────────
interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  className?: string;
  containerStyle?: React.CSSProperties;
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
  className = "",
  containerStyle,
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span style={{ display: "inline-block" }} className="sr-word" key={index}>
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

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          ease: "none",
          rotate: 0,
          scrollTrigger: { trigger: el, scroller, start: "top bottom", end: rotationEnd, scrub: true },
        }
      );

      const wordElements = el.querySelectorAll<HTMLElement>(".sr-word");

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: { trigger: el, scroller, start: "top bottom-=20%", end: wordAnimationEnd, scrub: true },
        }
      );

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: { trigger: el, scroller, start: "top bottom-=20%", end: wordAnimationEnd, scrub: true },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [children, scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <div ref={containerRef} style={containerStyle}>
      <p className={className} style={{ margin: 0 }}>
        {splitText}
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────
// Content data — based on the provided "Why Us" reference.
// Each heading is split into `headingMain` (navy) and
// `headingAccent` (coloured with the item's own accent),
// matching the "A-Roof (ASA Coating)" two-tone heading style.
// ─────────────────────────────────────────────
interface WhyUsItem {
  id: number;
  eyebrow: string;
  headingMain: string;
  headingAccent: string;
  body: string[];
  videoSrc: string;
  poster: string;
  accent: string;
}

const WHY_US_ITEMS: WhyUsItem[] = [
  {
    id: 1,
    eyebrow: "FIRE SAFETY STANDARD",
    headingMain: "Engineered for ",
    headingAccent: "Fire Safety",
    body: [
      "A-roof brings to you an upgrade to your roofing needs. It has been designed and manufactured overcoming all the negatives, and provides a better alternative to your traditional roofings. A-roof is the solution of the future.",
      "According to the UL94-2013 standard test insulated roof panels are proven to have a flame rating that is not less than V0. Which means, our PVC/ASA roofing sheets are non-flammable and the material performs efficiently in a fire on the exterior of the property.",
    ],
    videoSrc: "/prodect/dest-wind-tile-roof.mp4",
    poster: "/frames/why-us/fire-resistant.jpg",
    accent: "#e8700a",
  },
  {
    id: 2,
    eyebrow: "WEATHER & CHEMICAL RESISTANCE",
    headingMain: "Superior Corrosion ",
    headingAccent: "Resistance",
    body: [
      "Our range of roofing sheets has an excellent corrosion resistance, showing no chemical reactions when immersed in an acid solution of concentration below 70% saline solution or alkali solution for 24 hours. These roofing sheets are ideal for coastal areas as well as areas with frequent exposure to high humidity.",
    ],
    videoSrc: "/prodect/rain-tile-roof.mp4",
    poster: "/frames/why-us/corrosion-resistance.jpg",
    accent: "#1a56db",
  },
  {
    id: 3,
    eyebrow: "THERMAL PERFORMANCE",
    headingMain: "Remarkable Heat ",
    headingAccent: "Insulation",
    body: [
      "Our plastic roofing materials have remarkable heat insulation ability/performance. The heat conductivity efficiency is 0.07W/(m.K) which is 1/6 times more coefficient than cement roofing sheet and only 1/2200 times more coefficient than that of 0.5mm thick colour steel sheets.",
    ],
    videoSrc: "/prodect/steel-roof.mp4",
    poster: "/frames/why-us/heat-insulation.jpg",
    accent: "#f59e0b",
  },
  {
    id: 4,
    eyebrow: "ACOUSTIC COMFORT",
    headingMain: "Good Sound ",
    headingAccent: "Insulation",
    body: [
      "The test shows that the roofing sheets boast good noise-absorbing effect under the noise of rainstorm and strong wind. It is 30dB lower than steel roofs.",
    ],
    videoSrc: "/prodect/sun-tile-roof.mp4",
    poster: "/frames/why-us/sound-insulation.jpg",
    accent: "#6d28d9",
  },
  {
    id: 5,
    eyebrow: "UV & COLOUR PROTECTION",
    headingMain: "Long-Lasting Colour ",
    headingAccent: "Stability",
    body: [
      "Our PVC/ASA roofing sheets have an outstanding anti-UV performance with at least 10 years of colour stability (\u0394E\u22645) when exposed to varying temperatures and any other severe environmental conditions for outdoor use in areas with strong sun radiation.",
    ],
    videoSrc: "/videos/parts.mp4",
    poster: "/frames/why-us/colour-stability.jpg",
    accent: "#db2777",
  },
  {
    id: 6,
    eyebrow: "STRUCTURAL STRENGTH",
    headingMain: "High Loading & Bearing ",
    headingAccent: "Capacity",
    body: [
      "Our products have very high loading capacity. The roof sheet (3mm thick) can be bearing 120kg when the purlin spacing is less than 700mm.",
    ],
    videoSrc: "/prodect/Tile-roof.mp4",
    poster: "/frames/why-us/loading-capacity.jpg",
    accent: "#dc2626",
  },
  {
    id: 7,
    eyebrow: "INSTALLATION EFFICIENCY",
    headingMain: "Efficient & Convenient ",
    headingAccent: "Installation",
    body: [
      "Our weatherproof ASA-PVC roofing sheet weighs lesser than clay sheets. They offer an effective width of up to 1050mm, ensuring high installation efficiency. (They also cost lesser than clay sheets without affecting your budget roofing construction.)",
    ],
    videoSrc: "/prodect/Tile_roofing_sheet_weather_showcase_202606111218.mp4",
    poster: "/frames/why-us/installation.jpg",
    accent: "#0e7a55",
  },
];

// ─────────────────────────────────────────────
// Circular looping video — plays only while in view
// ─────────────────────────────────────────────
function CircleVideo({ src, poster, accent }: { src: string; poster: string; accent: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="wu-circle-wrap">
      <div className="wu-circle-halo" style={{ background: `${accent}1f` }} />
      <div className="wu-circle" style={{ borderColor: accent, boxShadow: `0 14px 36px ${accent}33` }}>
        <video ref={videoRef} src={src} poster={poster} muted loop playsInline className="wu-circle-video" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// One "Why Us" row — circular video left, content right
// ─────────────────────────────────────────────
function WhyUsRow({ item, index }: { item: WhyUsItem; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={rowRef} className="wu-row" style={{ background: index % 2 === 0 ? "#ffffff" : "#f7f9fc" }}>
      <div
        className="wu-video-col"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-50px)",
          transition: "opacity 0.8s ease 0.05s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.05s",
        }}
      >
        <CircleVideo src={item.videoSrc} poster={item.poster} accent={item.accent} />
      </div>

      <div
        className="wu-content-col"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease 0.18s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.18s",
        }}
      >
        <span className="wu-eyebrow">{item.eyebrow}</span>

        <h3 className="wu-heading">
          {item.headingMain}
          <span style={{ color: item.accent }}>{item.headingAccent}</span>
        </h3>

        {item.body.map((para, i) => (
          <ScrollReveal
            key={i}
            baseOpacity={0.08}
            baseRotation={2}
            blurStrength={4}
            enableBlur={true}
            rotationEnd="bottom center"
            wordAnimationEnd="bottom center"
            className="wu-body"
            containerStyle={{ marginBottom: i < item.body.length - 1 ? 14 : 0 }}
          >
            {para}
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main WhyUsSection
// ─────────────────────────────────────────────
export default function WhyUsSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeroVisible(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700;1,800;1,900&display=swap');

        .wu-root {
          font-family: 'Mulish', sans-serif;
          width: 100%;
          overflow: hidden;
        }

        /* ── Eyebrow pill — shared by hero and each row ── */
        .wu-eyebrow {
          display: inline-block;
          background: #e8f0fb;
          color: #002c5b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 7px 18px;
          border-radius: 6px;
          margin-bottom: 18px;
        }

        /* ── Hero ── */
        .wu-hero {
          width: 100%;
          background: #ffffff;
          padding: clamp(56px, 9vh, 110px) clamp(20px, 7vw, 96px) clamp(40px, 6vh, 72px);
        }
        .wu-hero-inner {
          max-width: 760px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease 0.1s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s;
        }
        .wu-hero-inner.wu-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .wu-hero-heading {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.12;
          color: #002c5b;
          margin: 0 0 16px;
        }
        .wu-hero-text {
          font-size: clamp(14px, 1.1vw, 16px);
          font-weight: 400;
          line-height: 1.85;
          color: #4a5568;
          max-width: 640px;
          margin: 0;
        }

        /* ── Rows ── */
        .wu-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: clamp(28px, 5vw, 72px);
          padding: clamp(40px, 6vh, 76px) clamp(20px, 7vw, 96px);
        }
        .wu-video-col {
          flex: 0 0 auto;
          display: flex;
          justify-content: center;
        }
        .wu-content-col {
          flex: 1 1 320px;
          min-width: 240px;
        }

        /* ── Circular video ── */
        .wu-circle-wrap {
          position: relative;
          width: clamp(170px, 18vw, 240px);
          height: clamp(170px, 18vw, 240px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wu-circle-halo {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          filter: blur(18px);
        }
        .wu-circle {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 6px solid;
          background: #0d1b2e;
        }
        .wu-circle-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Content text ── */
        .wu-heading {
          font-size: clamp(24px, 3vw, 38px);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.16;
          color: #002c5b;
          margin: 0 0 14px;
        }
        .wu-body {
          font-size: clamp(13px, 1vw, 15px);
          font-weight: 400;
          line-height: 1.85;
          color: #4a5568;
          max-width: 640px;
        }

        @media (max-width: 640px) {
          .wu-row { text-align: center; }
          .wu-video-col { flex-basis: 100%; justify-content: center; }
          .wu-content-col { flex-basis: 100%; }
          .wu-hero { text-align: center; }
          .wu-hero-text { margin-left: auto; margin-right: auto; }
        }
      `}</style>

      <section className="wu-root">
        {/* ── Hero ── */}
        <div className="wu-hero">
          <div ref={heroRef} className={`wu-hero-inner${heroVisible ? " wu-visible" : ""}`}>
            <span className="wu-eyebrow">Welcome to</span>
            <h1 className="wu-hero-heading">
              Why Choose <span style={{ color: "#e8700a" }}>A-Roof?</span>
            </h1>
            <ScrollReveal
              baseOpacity={0.08}
              baseRotation={2}
              blurStrength={4}
              enableBlur={true}
              rotationEnd="bottom center"
              wordAnimationEnd="bottom center"
              className="wu-hero-text"
            >
              A-Roof is an innovative product by Aqua Star. Keeping innovation at its core, the brand has successfully engraved a distinct space in the market within a very short span of time.
            </ScrollReveal>
          </div>
        </div>

        {/* ── Feature rows ── */}
        {WHY_US_ITEMS.map((item, i) => (
          <WhyUsRow key={item.id} item={item} index={i} />
        ))}
      </section>
    </>
  );
}