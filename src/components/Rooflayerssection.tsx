"use client";

import { useEffect, useRef, useState } from "react";

// ─── Layer data ────────────────────────────────────────────────────────────
const LAYERS = [
  {
    id: 1,
    title: "Structural Deck",
    description:
      "The foundation of every roof system. Typically constructed from plywood or OSB (oriented strand board), the structural deck is fastened directly to the roof framing and provides the surface to which all other layers are attached.",
    icon: "🏗️",
    color: "#b45309",
    bg: "#fef3c7",
    accentLight: "#fde68a",
  },
  {
    id: 2,
    title: "Underlayment",
    description:
      "A water-resistant or waterproof barrier installed directly onto the roof deck. It provides a secondary layer of protection against wind-driven rain and moisture intrusion, safeguarding the structure during and after installation.",
    icon: "🛡️",
    color: "#1d4ed8",
    bg: "#eff6ff",
    accentLight: "#bfdbfe",
  },
  {
    id: 3,
    title: "Ice & Water Shield",
    description:
      "A self-adhering polymer-modified bitumen membrane installed in vulnerable areas such as eaves, valleys, and around penetrations. It creates a watertight seal that prevents ice dam leakage and wind-driven rain infiltration.",
    icon: "❄️",
    color: "#0e7490",
    bg: "#ecfeff",
    accentLight: "#a5f3fc",
  },
  {
    id: 4,
    title: "Roofing Shingles",
    description:
      "The outermost visible layer providing weather resistance and aesthetic appeal. Modern architectural shingles offer 30–50 year lifespans, impact resistance ratings, and a range of colours to complement any home design.",
    icon: "🏠",
    color: "#15803d",
    bg: "#f0fdf4",
    accentLight: "#bbf7d0",
  },
  {
    id: 5,
    title: "Ridge Cap & Ventilation",
    description:
      "The topmost element of the roof system. Ridge caps seal the apex while ridge vents allow hot, moist air to escape from the attic, preventing heat buildup, moisture damage, and premature shingle deterioration.",
    icon: "💨",
    color: "#7c3aed",
    bg: "#f5f3ff",
    accentLight: "#ddd6fe",
  },
];

// ─── Roof layer SVG illustration ──────────────────────────────────────────
// Each layer is a 3D-perspective slab that rises into view as scrolling reveals it
const LAYER_CONFIGS = [
  // Layer 1 – Structural Deck (plywood texture, brown)
  { fill: "#c8a96e", stroke: "#a07840", label: "Structural Deck · Plywood / OSB" },
  // Layer 2 – Underlayment (dark grey felt)
  { fill: "#4b5563", stroke: "#374151", label: "Underlayment · Felt Barrier" },
  // Layer 3 – Ice & Water Shield (blue-black membrane)
  { fill: "#1e3a5f", stroke: "#0f2744", label: "Ice & Water Shield · Membrane" },
  // Layer 4 – Shingles (dark charcoal asphalt)
  { fill: "#2d2d2d", stroke: "#111", label: "Roofing Shingles · Architectural" },
  // Layer 5 – Ridge Cap (deep charcoal with ridge profile)
  { fill: "#1a1a1a", stroke: "#000", label: "Ridge Cap & Ventilation" },
];

function RoofLayerSVG({ revealedCount }) {
  // We draw 5 slabs in isometric-ish perspective, stacked bottom to top
  // Each slab animates upward from below when revealed
  const W = 460;
  const H = 420;
  const slabH = 22; // thickness of each slab side face
  const skew = 0.32; // horizontal skew factor
  const layerGap = 56; // vertical gap between layers

  // Base position for bottom layer
  const baseY = 330;
  const baseX = 40;
  const topW = 380; // top face width
  const topD = 90;  // top face depth (foreshortened)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ display: "block", overflow: "visible" }}
      aria-label="Animated roof layer diagram"
    >
      <defs>
        {/* Plywood grain pattern */}
        <pattern id="plywood" patternUnits="userSpaceOnUse" width="60" height="8">
          <rect width="60" height="8" fill="#c8a96e" />
          <line x1="0" y1="2" x2="60" y2="2" stroke="#b8924a" strokeWidth="0.7" opacity="0.6" />
          <line x1="0" y1="5.5" x2="60" y2="5.5" stroke="#d4b47e" strokeWidth="0.5" opacity="0.5" />
        </pattern>
        {/* Shingle pattern */}
        <pattern id="shingles" patternUnits="userSpaceOnUse" width="40" height="14">
          <rect width="40" height="14" fill="#2d2d2d" />
          <rect x="0" y="0" width="40" height="7" fill="#252525" />
          <line x1="20" y1="7" x2="20" y2="14" stroke="#1a1a1a" strokeWidth="1" />
          <line x1="0" y1="7" x2="40" y2="7" stroke="#1a1a1a" strokeWidth="1" />
          <rect x="1" y="8" width="18" height="5" fill="#333" rx="0.5" />
          <rect x="21" y="8" width="18" height="5" fill="#333" rx="0.5" />
          <rect x="1" y="1" width="18" height="5" fill="#2a2a2a" rx="0.5" />
          <rect x="21" y="1" width="18" height="5" fill="#2a2a2a" rx="0.5" />
        </pattern>
        {/* Membrane texture */}
        <pattern id="membrane" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="#1e3a5f" />
          <circle cx="10" cy="10" r="1.5" fill="#264d7a" opacity="0.6" />
        </pattern>
        {/* Underlayment texture */}
        <pattern id="felt" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#4b5563" />
          <line x1="0" y1="0" x2="10" y2="10" stroke="#55606e" strokeWidth="0.5" opacity="0.4" />
        </pattern>
        {/* Ridge cap */}
        <pattern id="ridgecap" patternUnits="userSpaceOnUse" width="30" height="10">
          <rect width="30" height="10" fill="#1a1a1a" />
          <rect x="2" y="2" width="26" height="6" fill="#222" rx="1" />
        </pattern>
        <filter id="slab-shadow" x="-5%" y="-5%" width="115%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.18" />
        </filter>
        <filter id="glow" x="-10%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#3b82f6" floodOpacity="0.35" />
        </filter>
      </defs>

      {LAYER_CONFIGS.map((cfg, i) => {
        const isRevealed = i < revealedCount;
        const isTop = i === Math.min(revealedCount, 5) - 1;
        // Each layer lifts up as revealed
        const yOffset = isRevealed ? 0 : 40;
        const opacity = isRevealed ? 1 : 0;
        const y = baseY - i * layerGap;
        // isometric top face: parallelogram
        // top-left, top-right, bottom-right, bottom-left
        const tl = { x: baseX, y: y };
        const tr = { x: baseX + topW, y: y };
        const br = { x: baseX + topW + topD * skew, y: y - topD * 0.5 };
        const bl = { x: baseX + topD * skew, y: y - topD * 0.5 };

        const fillPatterns = ["url(#plywood)", "url(#felt)", "url(#membrane)", "url(#shingles)", "url(#ridgecap)"];
        const sideColors = ["#a07840", "#374151", "#0f2744", "#111111", "#000000"];
        const frontColors = ["#b8924a", "#404a56", "#1a3354", "#222222", "#111111"];

        return (
          <g
            key={i}
            style={{
              transform: `translateY(${yOffset}px)`,
              opacity,
              transition: `transform 0.65s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s, opacity 0.5s ease ${i * 0.07}s`,
              filter: isTop && revealedCount > 0 ? "url(#glow)" : "url(#slab-shadow)",
            }}
          >
            {/* Front face (bottom trapezoid) */}
            <polygon
              points={`${tl.x},${tl.y} ${tr.x},${tr.y} ${tr.x},${tr.y + slabH} ${tl.x},${tl.y + slabH}`}
              fill={frontColors[i]}
            />
            {/* Right side face */}
            <polygon
              points={`${tr.x},${tr.y} ${br.x},${br.y} ${br.x},${br.y + slabH} ${tr.x},${tr.y + slabH}`}
              fill={sideColors[i]}
            />
            {/* Top face */}
            <polygon
              points={`${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`}
              fill={fillPatterns[i]}
            />
            {/* Top face highlight edge */}
            <line
              x1={bl.x} y1={bl.y}
              x2={br.x} y2={br.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            {/* Layer label */}
            {isRevealed && (
              <text
                x={tr.x + 14}
                y={tr.y + 6}
                fontFamily="'Mulish', 'Inter', sans-serif"
                fontSize="10.5"
                fontWeight="700"
                fill={isTop ? "#ffffff" : "rgba(255,255,255,0.55)"}
                style={{ transition: "fill 0.3s" }}
              >
                {cfg.label}
              </text>
            )}
          </g>
        );
      })}

      {/* "Scroll to reveal" arrow when nothing revealed */}
      {revealedCount === 0 && (
        <g style={{ animation: "bounce 1.6s ease-in-out infinite" }}>
          <text
            x={W / 2}
            y={H - 16}
            textAnchor="middle"
            fontFamily="'Mulish', sans-serif"
            fontSize="13"
            fontWeight="700"
            fill="#002c5b"
            opacity="0.5"
          >
            ↓ Scroll to reveal layers
          </text>
        </g>
      )}
      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </svg>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────
export function RoofLayersSection() {
  const sectionRef = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);

  const SCROLL_HEIGHT = 5 * 320 + 300;

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = -rect.top;
      if (sectionTop < 0) { setRevealedCount(0); return; }
      const maxScroll = SCROLL_HEIGHT - window.innerHeight;
      const revealed = Math.min(Math.ceil((sectionTop / maxScroll) * 5), 5);
      setRevealedCount(Math.max(revealed, 0));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDropdown = (id) =>
    setOpenDropdown((prev) => (prev === id ? null : id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&display=swap');
        .roof-section-wrap { scrollbar-width: none; -ms-overflow-style: none; }
        .roof-section-wrap::-webkit-scrollbar { display: none; }
        .roof-left-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .roof-left-scroll::-webkit-scrollbar { display: none; }
        .layer-card {
          border-radius: 14px;
          overflow: hidden;
          border: 1.5px solid rgba(0,44,91,0.10);
          background: #ffffff;
          transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
        }
        .layer-card.open {
          box-shadow: 0 4px 20px rgba(0,44,91,0.08);
        }
        .layer-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px 18px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .layer-btn:focus-visible { outline: 2px solid #1d6fbf; outline-offset: 2px; }
        .layer-body-wrap {
          overflow: hidden;
          transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .chevron {
          flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
          opacity: 0.45;
        }
        .chevron.open { transform: rotate(180deg); }
        @media (max-width: 768px) {
          .roof-inner { flex-direction: column !important; }
          .roof-right { min-height: 340px !important; flex: none !important; width: 100% !important; }
          .roof-left { flex: none !important; width: 100% !important; padding: 36px 24px 24px !important; }
        }
      `}</style>

      <div
        ref={sectionRef}
        className="roof-section-wrap"
        style={{ height: `${SCROLL_HEIGHT}px`, position: "relative", fontFamily: "'Mulish', sans-serif" }}
      >
        {/* Sticky viewport */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#f8f9fb",
          }}
        >
          <div
            className="roof-inner"
            style={{
              display: "flex",
              alignItems: "stretch",
              height: "100%",
            }}
          >
            {/* ── LEFT panel ──────────────────────────────────────── */}
            <div
              className="roof-left roof-left-scroll"
              style={{
                flex: "0 0 48%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "48px 40px 48px 56px",
                overflowY: "auto",
              }}
            >
              {/* Eyebrow */}
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#002c5b",
                  opacity: 0.45,
                  margin: "0 0 10px",
                }}
              >
                How a Roof is Built
              </p>

              {/* Heading */}
              <h2
                style={{
                  fontWeight: 900,
                  fontSize: "clamp(26px, 3vw, 42px)",
                  lineHeight: 1.13,
                  color: "#002c5b",
                  margin: "0 0 12px",
                }}
              >
                Understanding Roofing{" "}
                <span style={{ color: "#1d6fbf" }}>Inner Layers</span>
              </h2>

              <p
                style={{
                  fontSize: "15px",
                  color: "#002c5b",
                  opacity: 0.58,
                  margin: "0 0 28px",
                  lineHeight: 1.65,
                  maxWidth: "400px",
                }}
              >
                Scroll to explore each layer of a professional roof system —
                from the structural deck to the final ridge cap.
              </p>

              {/* Layer dropdowns */}
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {LAYERS.map((layer, idx) => {
                  const isRevealed = idx < revealedCount;
                  const isOpen = openDropdown === layer.id;
                  return (
                    <div
                      key={layer.id}
                      className={`layer-card${isOpen ? " open" : ""}`}
                      style={{
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? "translateY(0)" : "translateY(18px)",
                        transition: `opacity 0.48s ease ${idx * 0.07}s, transform 0.48s cubic-bezier(0.22,1,0.36,1) ${idx * 0.07}s, border-color 0.22s, background 0.22s`,
                        borderColor: isOpen ? `${layer.color}55` : "rgba(0,44,91,0.10)",
                        background: isOpen ? layer.bg : "#ffffff",
                        pointerEvents: isRevealed ? "auto" : "none",
                      }}
                    >
                      {/* Header */}
                      <button
                        className="layer-btn"
                        onClick={() => isRevealed && toggleDropdown(layer.id)}
                        aria-expanded={isOpen}
                      >
                        <span
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: layer.bg,
                            border: `1.5px solid ${layer.color}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          {layer.icon}
                        </span>
                        <span style={{ flex: 1 }}>
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              color: layer.color,
                              marginRight: 7,
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                            }}
                          >
                            Layer {layer.id}
                          </span>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 14.5,
                              color: "#002c5b",
                            }}
                          >
                            {layer.title}
                          </span>
                        </span>
                        <svg
                          className={`chevron${isOpen ? " open" : ""}`}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4 6l4 4 4-4"
                            stroke="#002c5b"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {/* Body */}
                      <div
                        className="layer-body-wrap"
                        style={{ maxHeight: isOpen ? "180px" : "0px" }}
                        aria-hidden={!isOpen}
                      >
                        <p
                          style={{
                            fontSize: 13.5,
                            lineHeight: 1.7,
                            color: "#002c5b",
                            opacity: 0.72,
                            margin: 0,
                            padding: "0 18px 16px 68px",
                          }}
                        >
                          {layer.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div
                style={{
                  marginTop: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                {LAYERS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 3,
                      flex: 1,
                      borderRadius: 99,
                      background: i < revealedCount ? "#002c5b" : "rgba(0,44,91,0.13)",
                      transition: `background 0.42s ease ${i * 0.06}s`,
                    }}
                  />
                ))}
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: "#002c5b",
                    opacity: 0.45,
                    marginLeft: 5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {revealedCount} / 5
                </span>
              </div>
            </div>

            {/* ── RIGHT panel ─────────────────────────────────────── */}
            <div
              className="roof-right"
              style={{
                flex: "0 0 52%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(145deg, #e8eef6 0%, #f0f4f9 60%, #e4ecf5 100%)",
                overflow: "hidden",
              }}
            >
              {/* Subtle grid bg */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "radial-gradient(circle, rgba(0,44,91,0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  pointerEvents: "none",
                }}
              />

              {/* SVG illustration card */}
              <div
                style={{
                  position: "relative",
                  width: "min(460px, 86%)",
                  aspectRatio: "1.1 / 1",
                  borderRadius: 22,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    "0 2px 0 rgba(255,255,255,0.8) inset, 0 28px 70px rgba(0,44,91,0.13), 0 2px 12px rgba(0,44,91,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px 20px 12px",
                }}
              >
                <RoofLayerSVG revealedCount={revealedCount} />
              </div>

              {/* Layer badge */}
              <div
                style={{
                  position: "absolute",
                  top: 28,
                  right: 28,
                  background: "#002c5b",
                  color: "#fff",
                  fontFamily: "'Mulish', sans-serif",
                  fontWeight: 800,
                  fontSize: 12.5,
                  padding: "8px 16px",
                  borderRadius: 99,
                  opacity: revealedCount > 0 ? 1 : 0,
                  transform: revealedCount > 0 ? "translateY(0)" : "translateY(-8px)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  boxShadow: "0 4px 14px rgba(0,44,91,0.22)",
                  pointerEvents: "none",
                }}
              >
                {revealedCount > 0
                  ? `Layer ${Math.min(revealedCount, 5)}: ${LAYERS[Math.min(revealedCount, 5) - 1]?.title}`
                  : ""}
              </div>

              {/* Corner accent */}
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 28,
                  fontFamily: "'Mulish', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#002c5b",
                  opacity: 0.3,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  pointerEvents: "none",
                }}
              >
                Cross-section View
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoofLayersSection;