"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 240;
const FRAME_PATH = (n: number) =>
  `/frames/frames_all/frame_${String(n).padStart(4, "0")}.jpg`;

// ─── Scroll-triggered content slides ─────────────────────────────────────────
const SLIDES = [
  {
    from: 0.05,
    to: 0.25,
    eyebrow: "WELCOME TO",
    heading: "A-ROOF\n(ASA Coating)",
    body: "A-Roof's sheet is ASA coated PVC roofing sheet — 3 layer co-extruded for superior UV, heat, and monsoon resistance.",
    stat: "25+",
    statLabel: "Years Warranty",
  },
  {
    from: 0.28,
    to: 0.48,
    eyebrow: "TRAFFORD UPVC",
    heading: "Zero Rust.\nZero Rot.",
    body: "Unlike traditional GI or Mangalore tiles, our sheets never corrode, never crack, and never need repainting.",
    stat: "3×",
    statLabel: "Stronger Than GI",
  },
  {
    from: 0.51,
    to: 0.71,
    eyebrow: "TILE UPVC SHEET",
    heading: "Classic Look.\nModern Strength.",
    body: "Get the timeless terracotta aesthetic at a fraction of the weight — easier installation, lower structural load.",
    stat: "60%",
    statLabel: "Lighter Than Clay Tile",
  },
  {
    from: 0.74,
    to: 0.94,
    eyebrow: "INSTALLATION",
    heading: "One Day.\nFull Roof.",
    body: "Our interlocking panel system snaps together fast. Most residential projects complete in a single day.",
    stat: "1 Day",
    statLabel: "Average Install Time",
  },
];

export default function RoofScrollAdBottom() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const imagesRef       = useRef<HTMLImageElement[]>([]);
  const loadedRef       = useRef<boolean[]>(Array(TOTAL_FRAMES).fill(false));
  const rafRef          = useRef<number | null>(null);
  const currentFrameRef = useRef(0);

  const [loadCount, setLoadCount]       = useState(0);
  const [allLoaded, setAllLoaded]       = useState(false);
  const [progress, setProgress]         = useState(0);
  const [activeSlide, setActiveSlide]   = useState<number | null>(null);
  const [slideVisible, setSlideVisible] = useState(false);

  // ── Draw frame ────────────────────────────────────────────────────────────
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[idx];
    if (!canvas || !img || !loadedRef.current[idx]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth  || 1280;
    const ih = img.naturalHeight || 720;
    const scale = Math.max(cw / iw, ch / ih);
    ctx.drawImage(img, (cw - iw * scale) / 2, (ch - ih * scale) / 2, iw * scale, ih * scale);
  }, []);

  // ── Preload frames ────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    let count   = 0;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    const onDone = () => {
      if (!mounted) return;
      count++;
      setLoadCount(count);
      if (count === TOTAL_FRAMES) setAllLoaded(true);
    };
    const first = new Image();
    first.onload = () => {
      if (!mounted) return;
      loadedRef.current[0] = true;
      imagesRef.current[0] = first;
      const canvas = canvasRef.current;
      if (canvas && canvas.width === 0) {
        canvas.width  = canvas.offsetWidth  || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
      }
      drawFrame(0);
      onDone();
    };
    first.onerror = onDone;
    first.src = FRAME_PATH(1);
    imgs[0] = first;
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const idx = i - 1;
      img.onload = () => { if (!mounted) return; loadedRef.current[idx] = true; onDone(); };
      img.onerror = onDone;
      img.src  = FRAME_PATH(i);
      imgs[idx] = img;
    }
    imagesRef.current = imgs;
    return () => { mounted = false; };
  }, [drawFrame]);

  // ── Resize canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  // ── Scroll handler ────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const maxScroll = container.offsetHeight - window.innerHeight;
      const scrolled  = Math.max(0, window.scrollY - container.offsetTop);
      const p         = Math.max(0, Math.min(1, scrolled / maxScroll));
      const fi        = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(p * (TOTAL_FRAMES - 1))));
      currentFrameRef.current = fi;
      drawFrame(fi);
      setProgress(p);
      const idx = SLIDES.findIndex(s => p >= s.from && p <= s.to);
      if (idx !== -1) { setActiveSlide(idx); setSlideVisible(true); }
      else { setSlideVisible(false); }
    });
  }, [drawFrame]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const loadPct = Math.round((loadCount / TOTAL_FRAMES) * 100);
  const slide   = activeSlide !== null ? SLIDES[activeSlide] : null;
  const dotProgress = SLIDES.map(s => {
    if (progress < s.from) return 0;
    if (progress > s.to)   return 1;
    return (progress - s.from) / (s.to - s.from);
  });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes roof-b-spin    { to { transform: rotate(360deg); } }
        @keyframes roof-b-fadeOut { to { opacity: 0; } }

        /* ── Slide up from bottom ── */
        @keyframes roof-b-slideUp {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes roof-b-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ──────────────────────────────────────────────────
           BOTTOM PANEL
           Positioned at the bottom of the sticky viewport.
           The blur overlay fades out toward the TOP.
        ────────────────────────────────────────────────── */
        .roof-b-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 55%;          /* how tall the panel is */
          max-height: 480px;
          display: flex;
          align-items: flex-end;  /* content sits at the bottom */
          pointer-events: none;
          z-index: 10;
          overflow: hidden;
        }

        /*
         * Dark + blurred overlay fading from bottom (opaque) to top (transparent).
         * backdrop-filter blurs the canvas frames behind it.
         */
        .roof-b-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.0)  0%,
            rgba(0, 0, 0, 0.60) 40%,
            rgba(0, 0, 0, 0.85) 100%
          );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          /* Mask: blur is strong at the bottom, zero at the top */
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 45%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 45%);
        }

        /* ── Inner content ── */
        .roof-b-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 64px 52px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-end;
          gap: 48px;
        }

        /* ── Slide animation ── */
        .roof-b-in  { animation: roof-b-slideUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .roof-b-out { opacity: 0; }

        /* ── Decorative rule + eyebrow ── */
        .roof-b-rule {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          animation: roof-b-fadeUp 0.35s ease 0.05s both;
        }
        .roof-b-rule-line {
          width: 32px; height: 2px;
          background: #e8700a;
          border-radius: 99px;
          flex-shrink: 0;
        }

        .roof-b-eyebrow {
          font-family: 'Mulish', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #e8700a;
        }

        /* ── Heading ── */
        .roof-b-heading {
          font-family: 'Mulish', sans-serif;
          font-size: clamp(28px, 3.2vw, 50px);
          font-weight: 900;
          line-height: 1.1;
          color: #ffffff;
          white-space: pre-line;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 24px rgba(0, 0, 0, 0.5);
          margin: 10px 0 0;
          animation: roof-b-fadeUp 0.42s ease 0.14s both;
        }

        /* ── Divider ── */
        .roof-b-divider {
          width: 48px; height: 3px;
          background: linear-gradient(to right, #e8700a, transparent);
          border-radius: 2px;
          margin: 14px 0;
          animation: roof-b-fadeUp 0.38s ease 0.20s both;
        }

        /* ── Body ── */
        .roof-b-body {
          font-family: 'Mulish', sans-serif;
          font-size: clamp(13px, 1.1vw, 15px);
          font-weight: 400;
          line-height: 1.82;
          color: rgba(255, 255, 255, 0.78);
          max-width: 480px;
          animation: roof-b-fadeUp 0.42s ease 0.28s both;
        }

        /* ── Stat block (right side of grid) ── */
        .roof-b-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
          animation: roof-b-fadeUp 0.42s ease 0.34s both;
          padding-bottom: 6px;
        }

        .roof-b-stat-num {
          font-family: 'Mulish', sans-serif;
          font-size: clamp(52px, 6vw, 84px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .roof-b-stat-label {
          font-family: 'Mulish', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #e8700a;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          text-align: right;
          max-width: 100px;
          line-height: 1.4;
        }

        /* ── Progress dots ── */
        .roof-b-dots {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 20;
          pointer-events: none;
        }
        .roof-b-dot-track {
          width: 36px; height: 2px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          overflow: hidden;
        }
        .roof-b-dot-fill {
          height: 100%;
          background: #e8700a;
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .roof-b-panel { height: 65%; max-height: 100%; }
          .roof-b-inner {
            grid-template-columns: 1fr;
            padding: 0 20px 80px;
            gap: 20px;
          }
          .roof-b-stat { align-items: flex-start; }
          .roof-b-stat-label { text-align: left; }
        }

        @media (prefers-reduced-motion: reduce) {
          .roof-b-in { animation: none; opacity: 1; }
          .roof-b-fadeUp { animation: none; opacity: 1; }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{ height: "600vh", position: "relative", backgroundColor: "#000" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            background: "#002c5b",
          }}
        >
          {/* ── Canvas ── */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />

          {/* ── Bottom panel ── */}
          {slide && (
            <div
              key={`slide-b-${activeSlide}`}
              className={`roof-b-panel ${slideVisible ? "roof-b-in" : "roof-b-out"}`}
            >
              <div className="roof-b-inner">

                {/* Left: eyebrow + heading + divider + body */}
                <div>
                  <div className="roof-b-rule">
                    <div className="roof-b-rule-line" />
                    <span className="roof-b-eyebrow">{slide.eyebrow}</span>
                  </div>
                  <h2 className="roof-b-heading">{slide.heading}</h2>
                  <div className="roof-b-divider" />
                  <p className="roof-b-body">{slide.body}</p>
                </div>

                {/* Right: large stat */}
                <div className="roof-b-stat">
                  <span className="roof-b-stat-num">{slide.stat}</span>
                  <span className="roof-b-stat-label">{slide.statLabel}</span>
                </div>

              </div>
            </div>
          )}

          {/* ── Progress dots ── */}
          {allLoaded && (
            <div className="roof-b-dots">
              {SLIDES.map((_, i) => (
                <div key={i} className="roof-b-dot-track">
                  <div
                    className="roof-b-dot-fill"
                    style={{ width: `${dotProgress[i] * 100}%` }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Loading screen ── */}
          {!allLoaded && (
            <div
              style={{
                position: "absolute", inset: 0,
                background: "#002c5b",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "20px", zIndex: 99,
                fontFamily: "'Mulish', sans-serif",
              }}
            >
              <div
                style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  border: "2px solid rgba(232, 112, 10, 0.2)",
                  borderTopColor: "#e8700a",
                  animation: "roof-b-spin 0.85s linear infinite",
                }}
              />
              <div style={{
                width: "160px", height: "2px",
                background: "rgba(255,255,255,0.10)",
                borderRadius: "1px", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  background: "#e8700a",
                  width: `${loadPct}%`,
                  transition: "width 0.2s ease",
                }} />
              </div>
              <span style={{
                color: "rgba(255,255,255,0.40)",
                fontSize: "10px",
                letterSpacing: "0.24em",
                textTransform: "uppercase" as const,
                fontWeight: 700,
                fontFamily: "'Mulish', sans-serif",
              }}>
                {loadPct}%
              </span>
            </div>
          )}

          {/* ── Scroll hint ── */}
          {allLoaded && progress < 0.03 && (
            <div
              style={{
                position: "absolute", bottom: "32px", left: "50%",
                transform: "translateX(-50%)",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "8px",
                zIndex: 10, pointerEvents: "none",
                opacity: 0.5,
                animation: "roof-b-fadeOut 1s ease 3s forwards",
                fontFamily: "'Mulish', sans-serif",
              }}
            >
              <span style={{
                color: "#fff",
                fontSize: "9px",
                letterSpacing: "0.28em",
                textTransform: "uppercase" as const,
                fontWeight: 800,
              }}>
                Scroll
              </span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 6l5 5 5-5" stroke="#e8700a" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  );
}