"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/products-parts.mp4"; // ← change to your actual video filename

const OVERLAY_LINES = [
  { progress: 0.0,  text: "Engineered for Kerala's Climate" },
  { progress: 0.33, text: "UV-Resistant. Weatherproof. Silent." },
  { progress: 0.66, text: "25-Year Durability. Zero Compromise." },
];

export default function VideoHeroSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [progress,  setProgress]  = useState(0);
  const [entered,   setEntered]   = useState(false);
  const [muted,     setMuted]     = useState(true);
  const [playing,   setPlaying]   = useState(false);

  // ── IntersectionObserver — play when visible ──────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          videoRef.current?.play().catch(() => {});
          setPlaying(true);
        } else {
          setEntered(false);
          setProgress(0);
          videoRef.current?.pause();
          setPlaying(false);
          if (videoRef.current) videoRef.current.currentTime = 0;
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Scroll → progress 0..1 ────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      const p    = Math.max(0, Math.min(1, (-rect.top) / (rect.height - vh)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Sync muted state ───────────────────────────────────────────────────────
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // ── Play/pause toggle ──────────────────────────────────────────────────────
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  // ── Scroll-driven geometry ─────────────────────────────────────────────────
  // Card starts at 68vw × 58vh with rounded corners
  // Expands to 100vw × 100vh flat as you scroll
  const br = 24 * (1 - progress);
  const w  = 68  + (100 - 68)  * progress;   // vw
  const h  = 58  + (100 - 58)  * progress;   // vh
  const ty = progress < 0.5
    ? -progress * 28
    : -28 + (progress - 0.5) * 56;

  // Which headline is currently active
  const activeIdx = [...OVERLAY_LINES]
    .reverse()
    .findIndex((l) => progress >= l.progress);
  const headlineIdx = activeIdx === -1 ? 0 : OVERLAY_LINES.length - 1 - activeIdx;

  // Overlay text fades at full progress
  const overlayOpacity = progress > 0.85 ? (1 - progress) / 0.15 : 1;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes vh-spin   { to { transform: rotate(360deg); } }
        @keyframes vh-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vh-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(0.92); }
        }
        @keyframes vh-lineGrow {
          from { width: 0; }
          to   { width: 100%; }
        }

        .vh-play-btn {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 8;
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 0;
        }
        .vh-play-ring {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255,255,255,0.28);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s, transform 0.25s;
        }
        .vh-play-btn:hover .vh-play-ring {
          background: rgba(232,112,10,0.85);
          transform: scale(1.08);
        }

        .vh-ctrl-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 999px;
          padding: 9px 18px;
          cursor: pointer;
          font-family: 'Mulish', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
          color: #0d2b4e;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: background 0.2s, color 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .vh-ctrl-btn:hover {
          background: #0d2b4e;
          color: #fff;
          transform: translateY(-1px);
        }

        .vh-headline {
          font-family: 'Mulish', sans-serif;
          font-weight: 900;
          font-size: clamp(22px, 3.2vw, 46px);
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.1;
          text-shadow: 0 2px 24px rgba(0,0,0,0.4);
          margin: 0;
        }

        .vh-eyebrow {
          font-family: 'Mulish', sans-serif;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #e8700a;
        }

        .vh-stat-label {
          font-family: 'Mulish', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .vh-stat-value {
          font-family: 'Mulish', sans-serif;
          font-size: clamp(18px, 2.2vw, 26px);
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        @media (max-width: 640px) {
          .vh-stats { display: none !important; }
          .vh-headline { font-size: clamp(18px, 5vw, 28px) !important; }
        }
      `}</style>

      {/* ── Top heading block ─────────────────────────────────────────────── */}
      <div style={{
        background: "#f5f7fa",
        textAlign: "center",
        padding: "88px 24px 60px",
        fontFamily: "'Mulish', sans-serif",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#fff",
          border: "1px solid #dde4ee",
          borderRadius: "99px",
          padding: "6px 18px",
          marginBottom: "20px",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#e8700a",
            animation: "vh-pulse 2s ease-in-out infinite",
            display: "inline-block",
          }} />
          <span style={{
            fontSize: "9px", fontWeight: 800,
            letterSpacing: "2.5px", color: "#0d2b4e",
          }}>
            A-ROOF · MANUFACTURING EXCELLENCE
          </span>
        </div>

        <h2 style={{
          margin: "0 0 16px",
          fontSize: "clamp(30px, 4.5vw, 58px)",
          fontWeight: 900,
          color: "#0d2b4e",
          lineHeight: 1.08,
          letterSpacing: "-0.5px",
        }}>
          See How A-Roof Is{" "}
          <span style={{
            color: "#e8700a",
            borderBottom: "3px solid #e8700a",
            paddingBottom: "2px",
          }}>
            Made
          </span>
        </h2>

        <p style={{
          margin: "0 auto",
          fontSize: "15px",
          fontWeight: 400,
          color: "#6b7f99",
          maxWidth: "500px",
          lineHeight: 1.75,
        }}>
          From raw UPVC resin to a finished roof — watch the process
          that delivers 25 years of weather-proof performance.
        </p>
      </div>

      {/* ── Scroll-driven sticky section ──────────────────────────────────── */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          height: "300vh",
          background: "#f5f7fa",
          fontFamily: "'Mulish', sans-serif",
        }}
      >
        <div style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#f5f7fa",
        }}>

          {/* ── Expanding video card ──────────────────────────────────────── */}
          <div style={{
            position: "relative",
            width: `${w}vw`,
            height: `${h}vh`,
            borderRadius: `${br}px`,
            overflow: "hidden",
            transform: `translateY(${ty}px)`,
            boxShadow: progress < 0.97
              ? `0 ${20 * (1 - progress)}px ${56 * (1 - progress)}px rgba(13,43,78,${0.22 * (1 - progress)})`
              : "none",
            willChange: "width, height, border-radius, transform",
          }}>

            {/* Video */}
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              playsInline
              loop
              muted={muted}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: entered ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            />

            {/* Dark gradient — bottom heavy for text legibility */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(
                  to bottom,
                  rgba(10,16,30,0.18) 0%,
                  transparent 30%,
                  transparent 50%,
                  rgba(10,16,30,0.72) 100%
                )
              `,
              pointerEvents: "none",
            }} />

            {/* Top-left: eyebrow + live dot */}
            <div style={{
              position: "absolute",
              top: "28px",
              left: "32px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              opacity: entered ? overlayOpacity : 0,
              transition: "opacity 0.4s",
              zIndex: 9,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "rgba(232,112,10,0.9)",
                borderRadius: "99px",
                padding: "5px 12px",
              }}>
                <span style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: "#fff",
                  animation: "vh-pulse 1.4s ease-in-out infinite",
                  display: "inline-block",
                }} />
                <span style={{
                  fontSize: "8px", fontWeight: 800,
                  letterSpacing: "2px", color: "#fff",
                  fontFamily: "'Mulish', sans-serif",
                }}>
                  A-ROOF PROCESS
                </span>
              </div>
            </div>

            {/* Center play/pause button */}
            <button className="vh-play-btn" onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.5s" }}
            >
              <div className="vh-play-ring">
                {playing ? (
                  // Pause icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <rect x="6"  y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  // Play icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"
                    style={{ marginLeft: "3px" }}>
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </div>
            </button>

            {/* Bottom-left: scroll-driven headline */}
            <div style={{
              position: "absolute",
              bottom: "32px",
              left: "32px",
              right: "160px",
              zIndex: 9,
              opacity: entered ? overlayOpacity : 0,
              transition: "opacity 0.3s",
            }}>
              {/* Progress bar */}
              <div style={{
                width: "40px", height: "2px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "2px",
                overflow: "hidden",
                marginBottom: "14px",
              }}>
                <div style={{
                  height: "100%",
                  background: "#e8700a",
                  width: `${progress * 100}%`,
                  transition: "width 0.1s linear",
                  borderRadius: "2px",
                }} />
              </div>

              <p className="vh-eyebrow" style={{ marginBottom: "8px" }}>
                {String(headlineIdx + 1).padStart(2, "0")} / {String(OVERLAY_LINES.length).padStart(2, "0")}
              </p>

              <h3
                key={headlineIdx}
                className="vh-headline"
                style={{ animation: "vh-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
              >
                {OVERLAY_LINES[headlineIdx].text}
              </h3>
            </div>

            {/* Bottom-right: stats row */}
            <div
              className="vh-stats"
              style={{
                position: "absolute",
                bottom: "32px",
                right: "32px",
                zIndex: 9,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "14px",
                opacity: entered ? overlayOpacity : 0,
                transition: "opacity 0.4s",
              }}
            >
              {[
                { value: "25+", label: "Year Warranty" },
                { value: "3×", label: "Stronger than GI" },
                { value: "60%", label: "Lighter than Clay" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "right" }}>
                  <div className="vh-stat-value">{s.value}</div>
                  <div className="vh-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bottom controls row */}
            <div style={{
              position: "absolute",
              bottom: "24px",
              right: "24px",
              display: "flex",
              gap: "8px",
              zIndex: 10,
              opacity: entered ? 1 : 0,
              transition: "opacity 0.5s",
            }}>
              {/* Mute toggle */}
              <button className="vh-ctrl-btn" onClick={() => setMuted((m) => !m)}>
                {muted ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
                {muted ? "UNMUTE" : "MUTE"}
              </button>
            </div>

            {/* Scroll hint — first few pixels only */}
            <div style={{
              position: "absolute",
              bottom: "32px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              opacity: progress < 0.05 && entered ? 0.55 : 0,
              transition: "opacity 0.5s",
              pointerEvents: "none",
            }}>
              <span style={{
                fontSize: "8px", letterSpacing: "3px",
                fontWeight: 800, color: "#fff",
                fontFamily: "'Mulish', sans-serif",
                textShadow: "0 1px 6px rgba(0,0,0,0.4)",
              }}>
                SCROLL TO EXPAND
              </span>
              <div style={{
                width: "1px", height: "22px",
                background: "rgba(255,255,255,0.45)",
              }} />
            </div>

          </div>{/* end card */}
        </div>
      </div>

      {/* ── Below-video CTA strip ─────────────────────────────────────────── */}
     
    </>
  );
}