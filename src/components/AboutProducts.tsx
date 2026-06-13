"use client";

import { useEffect, useRef, useState, useMemo, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// ScrollReveal component (same effect as ProductDetailsSection)
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
  style?: React.CSSProperties;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
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
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: { trigger: el, scroller, start: "top bottom", end: rotationEnd, scrub: true },
      }
    );

    const wordElements = el.querySelectorAll<HTMLElement>(".word");
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <div ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p style={style} className={`leading-[1.5] font-semibold ${textClassName}`}>
        {splitText}
      </p>
    </div>
  );
};

const SECTIONS = [
  {
    id: 1,
    eyebrow: "SOLAR RESISTANCE",
    headingBlack: "Beats the Sun.",
    headingBlue: "Every Single Day.",
    body: "Kerala's sun is relentless — peak UV index of 11+ for 8 months a year. A-Roof's ASA cap layer absorbs and deflects UV radiation, keeping the sheet colour-fast and structurally sound decade after decade. No bleaching. No brittleness.",
    stat: "11+",
    statLabel: "UV Index Rated",
    videoSrc: "/prodect/sun-tile-roof.mp4",
    poster: "/frames/roof-1/001.png",
    layout: "video-left",
    icon: "🌤️",
    accent: "#e8700a",
    accentBg: "#fff7f0",
    tag: "Sun & Heat",
  },
  {
    id: 2,
    eyebrow: "MONSOON PROOF",
    headingBlack: "Monsoon Season?",
    headingBlue: "Bring It On.",
    body: "With rainfall exceeding 3,000 mm annually across Kerala, a leaking roof isn't a nuisance — it's a catastrophe. Our interlocking double-seal geometry channels water away with zero penetration points, even at wind-driven rain speeds of 180 km/h.",
    stat: "3000+",
    statLabel: "mm Rainfall Rated",
    videoSrc: "/prodect/rain-tile-roof.mp4",
    poster: "/frames/roof-1/020.png",
    layout: "video-right",
    icon: "🌧️",
    accent: "#1a56db",
    accentBg: "#f0f5ff",
    tag: "Rain & Flood",
  },
  {
    id: 3,
    eyebrow: "STORM RESISTANCE",
    headingBlack: "Dust, Wind &",
    headingBlue: "Storm Ready.",
    body: "Cyclonic gusts, coastal salt spray, and fine laterite dust — A-Roof panels are mechanically fixed and aerodynamically profiled to resist uplift forces up to 250 km/h. The surface texture sheds particulate without trapping moisture or mould.",
    stat: "250",
    statLabel: "km/h Wind Rated",
    videoSrc: "/prodect/dest-wind-tile-roof.mp4",
    poster: "/frames/roof-1/040.png",
    layout: "video-left",
    icon: "🌪️",
    accent: "#6e3de8",
    accentBg: "#f5f0ff",
    tag: "Wind & Dust",
  },
];

function SectionTag({
  icon,
  label,
  accent,
  accentBg,
}: {
  icon: string;
  label: string;
  accent: string;
  accentBg: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: accentBg,
        border: `1px solid ${accent}22`,
        borderRadius: "999px",
        padding: "10px 20px",
        marginBottom: "28px",
        alignSelf: "flex-start",
      }}
    >
      <span style={{ fontSize: "16px", lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Mulish', sans-serif",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          color: accent,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function VideoBlock({
  src,
  poster,
  accent,
}: {
  src: string;
  poster: string;
  accent: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setPlaying(true);
        } else {
          videoRef.current?.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        aspectRatio: "16/10",
        background: "#f0f4f8",
        boxShadow: `0 20px 56px ${accent}1a, 0 4px 16px rgba(0,0,0,0.06)`,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      {/* bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent)",
          pointerEvents: "none",
        }}
      />
      {/* live badge */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(8px)",
          borderRadius: "999px",
          padding: "5px 14px",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: playing ? accent : "#cbd5e0",
            transition: "background 0.3s",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: playing ? accent : "#a0aec0",
          }}
        >
          {playing ? "Playing" : "Paused"}
        </span>
      </div>
    </div>
  );
}

function Section({
  section,
  index,
}: {
  section: (typeof SECTIONS)[0];
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isLeft = section.layout === "video-left";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const videoCol = (
    <div
      style={{
        flex: "1 1 48%",
        minWidth: "280px",
        transform: visible
          ? "translateX(0)"
          : `translateX(${isLeft ? "-70px" : "70px"})`,
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.04s, opacity 0.75s ease 0.04s",
      }}
    >
      <VideoBlock
        src={section.videoSrc}
        poster={section.poster}
        accent={section.accent}
      />
    </div>
  );

  const contentCol = (
    <div
      style={{
        flex: "1 1 44%",
        minWidth: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transform: visible
          ? "translateX(0)"
          : `translateX(${isLeft ? "70px" : "-70px"})`,
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.18s, opacity 0.75s ease 0.18s",
      }}
    >
      {/* full-width tag pill */}
      {/* <SectionTag
        icon={section.icon}
        label={section.tag}
        accent={section.accent}
        accentBg={section.accentBg}
      /> */}

      {/* eyebrow line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "2px",
            background: section.accent,
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.26em",
            textTransform: "uppercase" as const,
            color: section.accent,
          }}
        >
          {section.eyebrow}
        </span>
      </div>

      {/* heading — black line + blue line */}
      <h2
        style={{
          fontFamily: "'Mulish', sans-serif",
          margin: "0 0 14px",
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "clamp(26px, 2.8vw, 44px)",
            fontWeight: 900,
            color: "#0d1b2e",
          }}
        >
          {section.headingBlack}
        </span>
        <span
          style={{
            display: "block",
            fontSize: "clamp(26px, 2.8vw, 44px)",
            fontWeight: 900,
            color: section.accent,
          }}
        >
          {section.headingBlue}
        </span>
      </h2>

      {/* divider */}
      <div
        style={{
          width: "40px",
          height: "3px",
          background: `linear-gradient(to right, ${section.accent}, transparent)`,
          borderRadius: "2px",
          marginBottom: "18px",
        }}
      />

      {/* body — ScrollReveal text effect */}
      <ScrollReveal
        baseOpacity={0.08}
        baseRotation={3}
        blurStrength={5}
        enableBlur={true}
        rotationEnd="bottom center"
        wordAnimationEnd="bottom center"
        containerClassName="!mt-0 !mb-[30px]"
        textClassName="!leading-[1.9] !font-normal text-[#4a5568] max-w-[430px]"
        style={{ fontFamily: "'Mulish', sans-serif", fontSize: "clamp(13px, 1vw, 15px)" }}
      >
        {section.body}
      </ScrollReveal>

      {/* stat card */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "flex-end",
          gap: "10px",
          background: section.accentBg,
          border: `1px solid ${section.accent}20`,
          borderRadius: "12px",
          padding: "14px 20px",
          alignSelf: "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: "clamp(34px, 4vw, 50px)",
            fontWeight: 900,
            color: section.accent,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {section.stat}
        </span>
        <span
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: "#718096",
            textTransform: "uppercase" as const,
            letterSpacing: "0.12em",
            paddingBottom: "4px",
            lineHeight: 1.4,
            maxWidth: "80px",
          }}
        >
          {section.statLabel}
        </span>
      </div>
    </div>
  );

  return (
    <div
      ref={sectionRef}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "clamp(32px, 5vw, 80px)",
        padding:
          "clamp(56px, 8vh, 96px) clamp(20px, 7vw, 96px)",
        flexDirection: isLeft ? "row" : "row-reverse",
        background: index % 2 === 0 ? "#ffffff" : "#f8f9fc",
      }}
    >
      {videoCol}
      {contentCol}
    </div>
  );
}

export default function AboutProducts() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .ap-root {
          background: #ffffff;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .ap-eyebrow {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0s;
        }
        .ap-title {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease 0.12s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s;
        }
        .ap-sub {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s ease 0.22s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.22s;
        }
        .ap-pills {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease 0.34s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.34s;
        }
        .ap-visible .ap-eyebrow,
        .ap-visible .ap-title,
        .ap-visible .ap-sub,
        .ap-visible .ap-pills {
          opacity: 1;
          transform: translateY(0);
        }
        .ap-divider {
          width: calc(100% - clamp(40px, 14vw, 192px));
          margin: 0 auto;
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
        }
        @media (max-width: 680px) {
          .ap-section-row { flex-direction: column !important; }
        }
      `}</style>

      <section className="ap-root">

        {/* ── Header ── */}
        <div
          ref={headerRef}
          className={headerVisible ? "ap-visible" : ""}
          style={{
            padding:
              "clamp(64px, 10vh, 120px) clamp(20px, 7vw, 96px) clamp(40px, 5vh, 64px)",
            background: "#ffffff",
            maxWidth: "860px",
          }}
        >
          {/* eyebrow */}
          <div
            className="ap-eyebrow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "2px",
                background: "#1a56db",
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontFamily: "'Mulish', sans-serif",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#1a56db",
              }}
            >
              Our Product Range
            </span>
          </div>

          {/* title — two-tone like reference image */}
          <div className="ap-title" style={{ marginBottom: "18px" }}>
            <h1
              style={{
                fontFamily: "'Mulish', sans-serif",
                fontSize: "clamp(36px, 5.5vw, 72px)",
                fontWeight: 900,
                color: "#0d1b2e",
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
                margin: 0,
              }}
            >
              ASA Coated UPVC
            </h1>
            <h1
              style={{
                fontFamily: "'Mulish', sans-serif",
                fontSize: "clamp(36px, 5.5vw, 72px)",
                fontWeight: 900,
                color: "#1a56db",
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
                margin: 0,
              }}
            >
              Roofing Sheets.
            </h1>
          </div>

          {/* subtitle — ScrollReveal text effect */}
          <ScrollReveal
            baseOpacity={0.08}
            baseRotation={2}
            blurStrength={4}
            enableBlur={true}
            rotationEnd="bottom center"
            wordAnimationEnd="bottom center"
            containerClassName="ap-sub !mt-0 !mb-8"
            textClassName="!leading-[1.8] !font-normal text-[#4a5568] max-w-[520px]"
            style={{ fontFamily: "'Mulish', sans-serif", fontSize: "clamp(14px, 1.2vw, 17px)" }}
          >
            A-Roof's 3-layer co-extruded UPVC sheets are engineered with ASA anti-climate resin — retaining colour and strength against UV, heat, dampness, and impact for decades.
          </ScrollReveal>

          {/* weather pills */}

        </div>

        {/* ── Sections ── */}
        {SECTIONS.map((section, i) => (
          <div key={section.id}>
            {i > 0 && <div className="ap-divider" />}
            <Section section={section} index={i} />
          </div>
        ))}

        {/* ── Footer CTA ── */}
        {/* <div
          style={{
            textAlign: "center",
            padding: "clamp(48px, 7vh, 88px) 20px",
            background: "#f8f9fc",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#1a56db",
              marginBottom: "10px",
            }}
          >
            Ready to upgrade?
          </p>
          <h3
            style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: "clamp(22px, 3vw, 38px)",
              fontWeight: 900,
              color: "#0d1b2e",
              letterSpacing: "-0.02em",
              margin: "0 0 26px",
              lineHeight: 1.12,
            }}
          >
            Get a roof that fights back.
          </h3>
          <button
            style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ffffff",
              background: "#1a56db",
              border: "none",
              borderRadius: "6px",
              padding: "15px 40px",
              cursor: "pointer",
            }}
          >
            Get a Free Quote
          </button>
        </div> */}
      </section>
    </>
  );
}