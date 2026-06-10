"use client";

import { useEffect, useRef, useState } from "react";

// ─── Replace these with your actual video URLs ─────────────────────────────
const LEFT_VIDEO_SRC = "/videos/Modern_farmhouse_with_luxury_cars_202606101017.mp4";
const RIGHT_VIDEO_SRC = "/videos/Steel_roofing_sheets_commercial_202606101029.mp4";

// ─── A-Roof product content ──────────────────────────────────────────────────
const CONTENT = {
  eyebrow: "Our Product Range",
  heading: "ASA Coated UPVC\nRoofing Sheets.",
  subtext:
    "A-Roof's 3-layer co-extruded UPVC sheets are engineered with ASA anti-climate resin — retaining colour and strength against UV, heat, dampness, and impact for decades.",
  stats: [
    { value: "3-Layer", label: "Co-extruded UPVC" },
    { value: "30dB", label: "Noise reduction" },
    { value: "50yr", label: "Colour retention" },
  ],
  leftPanel: {
    tag: "Residential",
    caption: "Tile UPVC Sheet",
    subtitle: "Classic look. Modern protection.",
    productName: "Tile UPVC Sheet",
    description:
      "Tailored for residential properties, the Tile range blends traditional aesthetics with high-performance UPVC engineering — suitable for homes, villas, and bungalows.",
    features: ["Classic & elegant profile", "Ideal for residential use", "Enhanced kerb appeal"],
    sizes: ["12'3\" × 3'5\" — 41 sqft", "10'1\" × 3'5\" — 34 sqft", "7'11\" × 3'5\" — 27 sqft"],
    ctaLabel: "Explore Tile Sheet",
    ctaHref: "https://www.aroof.in/tile-upvc-sheet.html",
  },
  rightPanel: {
    tag: "Industrial",
    caption: "Trafford UPVC Sheet",
    subtitle: "Built for demanding environments.",
    productName: "Trafford UPVC Sheet",
    description:
      "Designed for industrial and commercial applications, Trafford roofing systems deliver unmatched strength and resilience — ideal for factories, warehouses, and large-span structures.",
    features: ["Robust & durable profile", "Industrial & commercial use", "Excellent weather resistance"],
    sizes: ["12' × 3'8\" — 44 sqft", "10' × 3'8\" — 37 sqft", "8' × 3'8\" — 29 sqft"],
    ctaLabel: "Explore Trafford Sheet",
    ctaHref: "https://www.aroof.in/trafford-upvc-sheet.html",
  },
  badges: [
    "UV Resistant",
    "Anti-Corrosive",
    "Noise Absorbing — 30dB Lower Than Steel",
    "Impact Resistant",
    "Colour Fast",
    "Lightweight",
    "3-Layer Co-Extruded",
  ],
};

export function DualVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setHasEntered(true);
          [leftVideoRef.current, rightVideoRef.current].forEach((v) => {
            if (v) v.play().catch(() => {});
          });
          setIsPlaying(true);
        } else {
          [leftVideoRef.current, rightVideoRef.current].forEach((v) => {
            if (v) v.pause();
          });
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&display=swap');

        .dvs-wrap {
          font-family: 'Mulish', sans-serif;
          background: #f8f9fb;
          width: 100%;
          overflow: hidden;
        }

        /* ── Top content ── */
        .dvs-top {
          padding: 76px 64px 56px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          background: #ffffff;
          border-bottom: 1px solid #eaedf1;
        }
        .dvs-top-left { max-width: 580px; }

        .dvs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #1d6fbf;
          margin-bottom: 14px;
        }
        .dvs-eyebrow::before {
          content: '';
          width: 24px; height: 2px;
          background: #1d6fbf;
          border-radius: 99px;
          flex-shrink: 0;
          display: block;
        }

        .dvs-heading {
          font-size: clamp(30px, 4vw, 50px);
          font-weight: 900;
          line-height: 1.06;
          color: #0d1117;
          white-space: pre-line;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .dvs-heading em { font-style: normal; color: #1d6fbf; }

        .dvs-subtext {
          font-size: 15px;
          line-height: 1.7;
          color: #6b7280;
          margin: 0;
          max-width: 460px;
        }

        /* Stats */
        .dvs-stat-row {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-shrink: 0;
        }
        .dvs-divider {
          width: 1px; height: 44px;
          background: #e5e7eb;
          align-self: center;
        }
        .dvs-stat { text-align: right; }
        .dvs-stat-value {
          font-size: clamp(22px, 2.4vw, 36px);
          font-weight: 900;
          color: #0d1117;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .dvs-stat-label {
          font-size: 10.5px;
          font-weight: 700;
          color: #9ca3af;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* ── Badge strip ── */
        .dvs-badge-strip {
          background: #0d1117;
          padding: 13px 64px;
          display: flex;
          align-items: center;
          gap: 0;
          overflow: hidden;
        }
        .dvs-badge-inner {
          display: flex;
          align-items: center;
          gap: 32px;
          animation: badge-scroll 22s linear infinite;
          white-space: nowrap;
        }
        @keyframes badge-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .dvs-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          flex-shrink: 0;
        }
        .dvs-badge-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #1d6fbf;
          flex-shrink: 0;
        }

        /* ── Video panels ── */
        .dvs-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 74vh;
          min-height: 500px;
          max-height: 820px;
          gap: 4px;
          padding: 4px;
          position: relative;
          background: #eaedf1;
        }

        .dvs-panel {
          position: relative;
          overflow: hidden;
          background: #dde1e8;
          cursor: pointer;
        }
        .dvs-panel:first-child { border-radius: 12px 0 0 12px; }
        .dvs-panel:last-child  { border-radius: 0 12px 12px 0; }

        .dvs-video {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.9s cubic-bezier(0.22,1,0.36,1),
                      filter 0.9s ease;
          filter: brightness(0.75) saturate(0.78);
          transform: scale(1.05);
          will-change: transform, filter;
        }
        .dvs-panel.playing .dvs-video {
          transform: scale(1.0);
          filter: brightness(0.82) saturate(0.95);
        }

        /* placeholder */
        .dvs-placeholder {
          position: absolute; inset: 0;
          background: #e8eaee;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.6s ease;
        }
        .dvs-placeholder.hidden { opacity: 0; pointer-events: none; }
        .dvs-placeholder-icon {
          width: 60px; height: 60px; border-radius: 50%;
          background: #ffffff;
          border: 1px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
        }

        /* gradient overlays */
        .dvs-overlay-bottom {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 45%,
            rgba(0,0,0,0.65) 100%
          );
          pointer-events: none; z-index: 1;
          transition: opacity 0.3s ease;
        }
        .dvs-panel:hover .dvs-overlay-bottom { opacity: 0.25; }

        /* ── Default caption ── */
        .dvs-caption {
          position: absolute;
          bottom: 30px; left: 28px;
          z-index: 3;
          display: flex; flex-direction: column; gap: 6px;
          transform: translateY(6px); opacity: 0;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s,
                      opacity 0.4s ease 0.25s;
          pointer-events: none;
        }
        .dvs-panel.playing .dvs-caption { transform: translateY(0); opacity: 1; }
        .dvs-panel:hover .dvs-caption   { opacity: 0; transform: translateY(4px); transition-delay: 0s; }

        .dvs-caption-tag {
          display: inline-flex; align-self: flex-start;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #ffffff;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.28);
          padding: 3px 10px; border-radius: 99px;
          backdrop-filter: blur(6px);
        }
        .dvs-caption-title {
          font-size: 22px; font-weight: 900;
          color: #ffffff; letter-spacing: -0.02em;
          text-shadow: 0 2px 14px rgba(0,0,0,0.45);
          line-height: 1.1;
        }
        .dvs-caption-subtitle {
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.65);
        }

        /* ── Hover overlay ── */
        .dvs-hover-overlay {
          position: absolute; inset: 0; z-index: 4;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0 32px 34px;
          background: linear-gradient(
            to top,
            rgba(255,255,255,0.98) 0%,
            rgba(255,255,255,0.93) 36%,
            rgba(255,255,255,0.5) 56%,
            rgba(255,255,255,0.0) 76%
          );
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.35s cubic-bezier(0.22,1,0.36,1),
                      transform 0.35s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }
        .dvs-panel:hover .dvs-hover-overlay {
          opacity: 1; transform: translateY(0);
          pointer-events: auto;
        }

        .dvs-hover-tag {
          display: inline-flex; align-self: flex-start;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #1d6fbf;
          background: rgba(29,111,191,0.09);
          border: 1px solid rgba(29,111,191,0.22);
          padding: 3px 10px; border-radius: 99px;
          margin-bottom: 10px;
        }
        .dvs-hover-name {
          font-size: clamp(20px, 2.1vw, 26px);
          font-weight: 900; color: #0d1117;
          letter-spacing: -0.02em; line-height: 1.1;
          margin: 0 0 5px;
        }
        .dvs-hover-subtitle {
          font-size: 13px; font-weight: 700;
          color: #1d6fbf; margin: 0 0 12px;
        }
        .dvs-hover-desc {
          font-size: 13px; line-height: 1.65;
          color: #4b5563; margin: 0 0 14px;
          max-width: 360px;
        }
        .dvs-hover-features {
          display: flex; flex-direction: column; gap: 5px;
          margin: 0 0 16px; list-style: none; padding: 0;
        }
        .dvs-hover-features li {
          display: flex; align-items: center; gap: 8px;
          font-size: 12.5px; font-weight: 700; color: #374151;
        }
        .dvs-hover-features li::before {
          content: '';
          width: 6px; height: 6px; border-radius: 50%;
          background: #1d6fbf; flex-shrink: 0;
        }
        .dvs-hover-sizes {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin: 0 0 22px;
        }
        .dvs-hover-size-pill {
          font-size: 10px; font-weight: 800;
          color: #374151;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 4px 10px; border-radius: 6px;
          letter-spacing: 0.03em;
        }
        .dvs-hover-cta {
          display: inline-flex; align-items: center; gap: 8px;
          align-self: flex-start;
          font-family: 'Mulish', sans-serif;
          font-size: 11.5px; font-weight: 900;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #ffffff;
          background: #0d1117;
          border: none; border-radius: 8px;
          padding: 12px 22px;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .dvs-hover-cta:hover { background: #1d6fbf; transform: translateY(-1px); }
        .dvs-hover-cta:active { transform: translateY(0); }
        .dvs-hover-cta svg { transition: transform 0.2s ease; }
        .dvs-hover-cta:hover svg { transform: translateX(3px); }

        /* ── Play/pause ── */
        .dvs-play-btn {
          position: absolute; top: 18px; right: 18px; z-index: 5;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(0,0,0,0.1);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          opacity: 0; transform: scale(0.85);
          transition: opacity 0.3s, transform 0.3s, background 0.2s;
        }
        .dvs-panel:hover .dvs-play-btn { opacity: 1; transform: scale(1); }
        .dvs-play-btn:hover { background: rgba(255,255,255,1) !important; }

        /* ── Center divider ── */
        .dvs-center-line {
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 100%;
          background: #f8f9fb;
          pointer-events: none; z-index: 3;
          opacity: 0; transition: opacity 0.8s ease 0.4s;
        }
        .dvs-panels.playing-state .dvs-center-line { opacity: 1; }

        /* ── Scroll / hover cue ── */
        .dvs-scroll-cue {
          position: absolute; bottom: 30px; left: 50%;
          transform: translateX(-50%);
          z-index: 6;
          display: flex; flex-direction: column; align-items: center; gap: 7px;
          opacity: 1; transition: opacity 0.5s ease; pointer-events: none;
        }
        .dvs-scroll-cue.hidden { opacity: 0; }
        .dvs-scroll-cue span {
          font-size: 9.5px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .dvs-scroll-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.5);
          animation: scroll-pulse 1.8s ease-in-out infinite;
        }
        @keyframes scroll-pulse {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(4px); }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .dvs-top { padding: 52px 32px 44px; }
          .dvs-badge-strip { padding: 12px 32px; }
        }
        @media (max-width: 768px) {
          .dvs-top {
            flex-direction: column; align-items: flex-start;
            padding: 44px 24px 36px; gap: 28px;
          }
          .dvs-stat-row { justify-content: flex-start; }
          .dvs-stat { text-align: left; }
          .dvs-badge-strip { padding: 12px 24px; }
          .dvs-panels {
            grid-template-columns: 1fr;
            height: auto; max-height: none; gap: 4px;
          }
          .dvs-panel { height: 74vw; min-height: 300px; }
          .dvs-panel:first-child { border-radius: 12px 12px 0 0; }
          .dvs-panel:last-child  { border-radius: 0 0 12px 12px; }
          .dvs-center-line { display: none; }
          .dvs-hover-overlay { padding: 0 20px 24px; }
          .dvs-hover-desc { display: none; }
          .dvs-hover-sizes { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dvs-video, .dvs-caption, .dvs-hover-overlay { transition: none; }
          .dvs-badge-inner { animation: none; }
        }
      `}</style>

      <section ref={sectionRef} className="dvs-wrap" aria-label="A-Roof Product Showcase">

        {/* ── Top content ── */}
        <div className="dvs-top">
          <div className="dvs-top-left">
            <p className="dvs-eyebrow">{CONTENT.eyebrow}</p>
            <h2 className="dvs-heading">
              ASA Coated UPVC{"\n"}<em>Roofing Sheets.</em>
            </h2>
            <p className="dvs-subtext">{CONTENT.subtext}</p>
          </div>
          <div className="dvs-stat-row">
            {CONTENT.stats.map((s, i) => (
              <>
                {i > 0 && <div key={`div-${i}`} className="dvs-divider" />}
                <div key={s.value} className="dvs-stat">
                  <div className="dvs-stat-value">{s.value}</div>
                  <div className="dvs-stat-label">{s.label}</div>
                </div>
              </>
            ))}
          </div>
        </div>

        {/* ── Scrolling badge strip ── */}
        <div className="dvs-badge-strip" aria-hidden="true">
          <div className="dvs-badge-inner">
            {/* Duplicated for seamless loop */}
            {[...CONTENT.badges, ...CONTENT.badges].map((b, i) => (
              <span key={i} className="dvs-badge">
                <span className="dvs-badge-dot" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ── Video panels ── */}
        <div className={`dvs-panels${isPlaying ? " playing-state" : ""}`}>
          <div className="dvs-center-line" />

          {/* LEFT — Tile UPVC */}
          <div className={`dvs-panel${isPlaying ? " playing" : ""}`}>
            <div className={`dvs-placeholder${hasEntered ? " hidden" : ""}`}>
              <div className="dvs-placeholder-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 5l8 5-8 5V5z" fill="rgba(0,0,0,0.28)" />
                </svg>
              </div>
            </div>

            <video ref={leftVideoRef} src={LEFT_VIDEO_SRC} className="dvs-video"
              muted loop playsInline preload="metadata"
              aria-label={CONTENT.leftPanel.productName} />

            <div className="dvs-overlay-bottom" />

            <div className="dvs-caption">
              <span className="dvs-caption-tag">{CONTENT.leftPanel.tag}</span>
              <span className="dvs-caption-title">{CONTENT.leftPanel.caption}</span>
              <span className="dvs-caption-subtitle">{CONTENT.leftPanel.subtitle}</span>
            </div>

            <div className="dvs-hover-overlay">
              <span className="dvs-hover-tag">{CONTENT.leftPanel.tag}</span>
              <h3 className="dvs-hover-name">{CONTENT.leftPanel.productName}</h3>
              <p className="dvs-hover-subtitle">{CONTENT.leftPanel.subtitle}</p>
              <p className="dvs-hover-desc">{CONTENT.leftPanel.description}</p>
              <ul className="dvs-hover-features">
                {CONTENT.leftPanel.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="dvs-hover-sizes">
                {CONTENT.leftPanel.sizes.map((s) => (
                  <span key={s} className="dvs-hover-size-pill">{s}</span>
                ))}
              </div>
              <a href={CONTENT.leftPanel.ctaHref} className="dvs-hover-cta"
                target="_blank" rel="noopener noreferrer">
                {CONTENT.leftPanel.ctaLabel}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <PlayPauseButton videoRef={leftVideoRef} />
          </div>

          {/* RIGHT — Trafford UPVC */}
          <div className={`dvs-panel${isPlaying ? " playing" : ""}`}>
            <div className={`dvs-placeholder${hasEntered ? " hidden" : ""}`}>
              <div className="dvs-placeholder-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 5l8 5-8 5V5z" fill="rgba(0,0,0,0.28)" />
                </svg>
              </div>
            </div>

            <video ref={rightVideoRef} src={RIGHT_VIDEO_SRC} className="dvs-video"
              muted loop playsInline preload="metadata"
              aria-label={CONTENT.rightPanel.productName} />

            <div className="dvs-overlay-bottom" />

            <div className="dvs-caption">
              <span className="dvs-caption-tag">{CONTENT.rightPanel.tag}</span>
              <span className="dvs-caption-title">{CONTENT.rightPanel.caption}</span>
              <span className="dvs-caption-subtitle">{CONTENT.rightPanel.subtitle}</span>
            </div>

            <div className="dvs-hover-overlay">
              <span className="dvs-hover-tag">{CONTENT.rightPanel.tag}</span>
              <h3 className="dvs-hover-name">{CONTENT.rightPanel.productName}</h3>
              <p className="dvs-hover-subtitle">{CONTENT.rightPanel.subtitle}</p>
              <p className="dvs-hover-desc">{CONTENT.rightPanel.description}</p>
              <ul className="dvs-hover-features">
                {CONTENT.rightPanel.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="dvs-hover-sizes">
                {CONTENT.rightPanel.sizes.map((s) => (
                  <span key={s} className="dvs-hover-size-pill">{s}</span>
                ))}
              </div>
              <a href={CONTENT.rightPanel.ctaHref} className="dvs-hover-cta"
                target="_blank" rel="noopener noreferrer">
                {CONTENT.rightPanel.ctaLabel}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <PlayPauseButton videoRef={rightVideoRef} />
          </div>

          <div className={`dvs-scroll-cue${isPlaying ? " hidden" : ""}`}>
            <span>Hover to explore</span>
            <div className="dvs-scroll-dot" />
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Play / Pause toggle ────────────────────────────────────────────────────
function PlayPauseButton({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
  const [paused, setPaused] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); }
    else          { v.pause(); setPaused(true); }
  };

  return (
    <button className="dvs-play-btn" onClick={toggle}
      aria-label={paused ? "Play video" : "Pause video"}>
      {paused ? (
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
          <path d="M2 1.5l9 5.5-9 5.5V1.5z" fill="#0d1117" />
        </svg>
      ) : (
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
          <rect x="1" y="1" width="3" height="11" rx="1" fill="#0d1117" />
          <rect x="7" y="1" width="3" height="11" rx="1" fill="#0d1117" />
        </svg>
      )}
    </button>
  );
}

export default DualVideoSection;