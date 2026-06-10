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
    side: "left" as const,
    eyebrow: "WELCOME TO",
    heading: "A-ROOF\n(ASA Coating)",
    body: "A-Roof's sheet is ASA coated PVC roofing sheet — 3 layer co-extruded for superior UV, heat, and monsoon resistance.",
    stat: "25+",
    statLabel: "Years Warranty",
  },
  {
    from: 0.28,
    to: 0.48,
    side: "right" as const,
    eyebrow: "TRAFFORD UPVC",
    heading: "Zero Rust.\nZero Rot.",
    body: "Unlike traditional GI or Mangalore tiles, our sheets never corrode, never crack, and never need repainting.",
    stat: "3×",
    statLabel: "Stronger Than GI",
  },
  {
    from: 0.51,
    to: 0.71,
    side: "left" as const,
    eyebrow: "TILE UPVC SHEET",
    heading: "Classic Look.\nModern Strength.",
    body: "Get the timeless terracotta aesthetic at a fraction of the weight — easier installation, lower structural load.",
    stat: "60%",
    statLabel: "Lighter Than Clay Tile",
  },
  {
    from: 0.74,
    to: 0.94,
    side: "right" as const,
    eyebrow: "INSTALLATION",
    heading: "One Day.\nFull Roof.",
    body: "Our interlocking panel system snaps together fast. Most residential projects complete in a single day.",
    stat: "1 Day",
    statLabel: "Average Install Time",
  },
];

export default function RoofScrollAd() {
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
      {/* Mulish font — matches AboutSection */}
      <link
        href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes roof-spin    { to { transform: rotate(360deg); } }
        @keyframes roof-fadeOut { to { opacity: 0; } }

        @keyframes roof-slideInLeft {
          from { opacity: 0; transform: translateX(-56px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes roof-slideInRight {
          from { opacity: 0; transform: translateX(56px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes roof-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Panel shell ── */
        .roof-panel {
          position: absolute;
          top: 0; bottom: 0;
          width: 52%;
          max-width: 680px;
          display: flex;
          align-items: center;
          pointer-events: none;
          z-index: 10;
          overflow: hidden;
        }
        .roof-panel.left  { left: 0; }
        .roof-panel.right { right: 0; }

        /*
         * ── Blurred dark overlay — LEFT ──
         * backdrop-filter blurs whatever is behind (the canvas frames).
         * The dark rgba layer sits on top for contrast.
         */
        .roof-panel.left::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.82) 0%,
            rgba(0, 0, 0, 0.65) 60%,
            rgba(0, 0, 0, 0.0)  100%
          );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          /* Clip the blur so it fades out toward the right edge */
          -webkit-mask-image: linear-gradient(to right, black 55%, transparent 100%);
          mask-image: linear-gradient(to right, black 55%, transparent 100%);
        }

        /*
         * ── Blurred dark overlay — RIGHT ──
         */
        .roof-panel.right::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.82) 0%,
            rgba(0, 0, 0, 0.65) 60%,
            rgba(0, 0, 0, 0.0)  100%
          );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          -webkit-mask-image: linear-gradient(to left, black 55%, transparent 100%);
          mask-image: linear-gradient(to left, black 55%, transparent 100%);
        }

        /* ── Inner content ── */
        .roof-inner {
          position: relative; z-index: 1;
          padding: 0 48px 0 64px;
          display: flex; flex-direction: column; gap: 22px;
          width: 100%;
        }
        .roof-panel.right .roof-inner {
          padding: 0 64px 0 48px;
          align-items: flex-end;
          text-align: right;
        }

        /* ── Slide animations ── */
        .roof-in-left  { animation: roof-slideInLeft  0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .roof-in-right { animation: roof-slideInRight 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .roof-hidden   { opacity: 0; }

        /* ── Decorative top rule ── */
        .roof-rule {
          display: flex; align-items: center; gap: 12px;
          animation: roof-fadeUp 0.4s ease 0.05s both;
        }
        .roof-panel.right .roof-rule { flex-direction: row-reverse; }
        .roof-rule-line {
          width: 36px; height: 2px;
          background: #e8700a;
          flex-shrink: 0;
        }

        /* ── Eyebrow ── */
        .roof-eyebrow {
          font-family: 'Mulish', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #e8700a;
          animation: roof-fadeUp 0.4s ease 0.05s both;
        }

        /* ── Heading ── */
        .roof-heading {
          font-family: 'Mulish', sans-serif;
          font-size: clamp(30px, 3.4vw, 52px);
          font-weight: 900;
          line-height: 1.1;
          color: #ffffff;
          white-space: pre-line;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 24px rgba(0, 0, 0, 0.5);
          animation: roof-fadeUp 0.45s ease 0.15s both;
        }

        /* ── Divider ── */
        .roof-divider {
          width: 52px; height: 3px;
          background: linear-gradient(to right, #e8700a, transparent);
          border-radius: 2px;
          animation: roof-fadeUp 0.4s ease 0.22s both;
        }
        .roof-panel.right .roof-divider {
          background: linear-gradient(to left, #e8700a, transparent);
          margin-left: auto;
        }

        /* ── Body copy ── */
        .roof-body {
          font-family: 'Mulish', sans-serif;
          font-size: clamp(13px, 1.2vw, 16px);
          font-weight: 400;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.82);
          max-width: 380px;
          animation: roof-fadeUp 0.45s ease 0.28s both;
        }
        .roof-panel.right .roof-body { margin-left: auto; }

        /* ── Stat block ── */
        .roof-stat-row {
          display: flex; align-items: flex-end; gap: 10px;
          animation: roof-fadeUp 0.45s ease 0.36s both;
        }
        .roof-panel.right .roof-stat-row { justify-content: flex-end; }

        .roof-stat-num {
          font-family: 'Mulish', sans-serif;
          font-size: clamp(44px, 5vw, 68px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .roof-stat-label {
          font-family: 'Mulish', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #e8700a;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          max-width: 80px;
          line-height: 1.4;
          padding-bottom: 6px;
        }

        /* ── Progress dots ── */
        .roof-dots {
          position: absolute;
          bottom: 28px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 10px;
          z-index: 20; pointer-events: none;
        }
        .roof-dot-track {
          width: 36px; height: 2px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px; overflow: hidden;
        }
        .roof-dot-fill {
          height: 100%;
          background: #e8700a;
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .roof-panel {
            width: 100%;
            max-width: 100%;
            align-items: flex-end;
          }
          .roof-panel.left::before,
          .roof-panel.right::before {
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.90) 0%,
              rgba(0, 0, 0, 0.0)  68%
            );
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            -webkit-mask-image: linear-gradient(to top, black 55%, transparent 100%);
            mask-image: linear-gradient(to top, black 55%, transparent 100%);
          }
          .roof-inner { padding: 0 24px 72px !important; }
          .roof-panel.right .roof-inner {
            align-items: flex-start; text-align: left;
          }
          .roof-panel.right .roof-stat-row { justify-content: flex-start; }
          .roof-panel.right .roof-body { margin-left: 0; }
          .roof-panel.right .roof-divider {
            background: linear-gradient(to right, #e8700a, transparent);
            margin-left: 0;
          }
          .roof-panel.right .roof-rule { flex-direction: row; }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{ height: "600vh", position: "relative", backgroundColor: "#000" }}
      >
        <div
          style={{
            position: "sticky", top: 0,
            height: "100vh", width: "100%",
            overflow: "hidden", background: "#002c5b",
          }}
        >
          {/* ── Canvas ── */}
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
          />

          {/* ── Slide panel ── */}
          {slide && (
            <div
              key={`slide-${activeSlide}`}
              className={`roof-panel ${slide.side} ${
                slideVisible
                  ? slide.side === "left" ? "roof-in-left" : "roof-in-right"
                  : "roof-hidden"
              }`}
            >
              <div className="roof-inner">
                {/* Rule + eyebrow */}
                <div className="roof-rule">
                  <div className="roof-rule-line" />
                  <span className="roof-eyebrow">{slide.eyebrow}</span>
                </div>

                {/* Heading */}
                <h2 className="roof-heading">{slide.heading}</h2>

                {/* Orange divider */}
                <div className="roof-divider" />

                {/* Body */}
                <p className="roof-body">{slide.body}</p>

                {/* Stat */}
                <div className="roof-stat-row">
                  <span className="roof-stat-num">{slide.stat}</span>
                  <span className="roof-stat-label">{slide.statLabel}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Progress dots ── */}
          {allLoaded && (
            <div className="roof-dots">
              {SLIDES.map((_, i) => (
                <div key={i} className="roof-dot-track">
                  <div className="roof-dot-fill" style={{ width: `${dotProgress[i] * 100}%` }} />
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
              {/* Spinner */}
              <div
                style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  border: "2px solid rgba(232, 112, 10, 0.2)",
                  borderTopColor: "#e8700a",
                  animation: "roof-spin 0.85s linear infinite",
                }}
              />
              {/* Progress track */}
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
              {/* Percentage label */}
              <span style={{
                color: "rgba(255,255,255,0.40)",
                fontSize: "10px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
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
                opacity: 0.5, animation: "roof-fadeOut 1s ease 3s forwards",
                fontFamily: "'Mulish', sans-serif",
              }}
            >
              <span style={{
                color: "#fff",
                fontSize: "9px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 800,
              }}>
                Scroll
              </span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 6l5 5 5-5" stroke="#e8700a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  );
}