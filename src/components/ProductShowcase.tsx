"use client";
import { useEffect, useRef, useState } from "react";

const productImages = [
  {
    id: 1,
    default: "/prodect/1 (1).png",
    hover: "/prodect/home-1.webp",
    label: "Hero Builder",
    href: "/products/hero-builder",
  },
  {
    id: 2,
    default: "https://assets.aceternity.com/components/3d-globe.webp",
    hover: "https://assets.aceternity.com/components/hero-2.webp",
    label: "3D Globe",
    href: "/products/3d-globe",
  },
  {
    id: 3,
    default: "https://assets.aceternity.com/components/keyboard-2.webp",
    hover: "https://assets.aceternity.com/components/hero-3.webp",
    label: "Keyboard UI",
    href: "/products/keyboard-ui",
  },
  {
    id: 4,
    default: "https://assets.aceternity.com/components/hero-1.webp",
    hover: "https://assets.aceternity.com/components/hero-section-with-mesh-gradient.webp",
    label: "Mesh Gradient",
    href: "/products/mesh-gradient",
  },
  {
    id: 5,
    default: "https://assets.aceternity.com/components/hero-2.webp",
    hover: "https://assets.aceternity.com/components/3d-globe.webp",
    label: "Globe UI",
    href: "/products/globe-ui",
  },
  {
    id: 6,
    default: "https://assets.aceternity.com/components/hero-3.webp",
    hover: "https://assets.aceternity.com/components/keyboard-2.webp",
    label: "Component Kit",
    href: "/products/component-kit",
  },
];

const depths = [0.02, 0.035, 0.05];

const positions: React.CSSProperties[][] = [
  [
    { top: "18%", left: "3%", width: "220px", height: "155px" },
    { bottom: "15%", right: "3%", width: "200px", height: "140px" },
  ],
  [
    { top: "20%", right: "4%", width: "210px", height: "148px" },
    { bottom: "18%", left: "4%", width: "195px", height: "138px" },
  ],
  [
    { top: "50%", left: "1.5%", width: "180px", height: "128px" },
    { top: "48%", right: "1.5%", width: "185px", height: "130px" },
  ],
];

function ParallaxImage({
  img,
  style,
  onHover,
  onLeave,
}: {
  img: (typeof productImages)[0];
  style: React.CSSProperties;
  onHover: (img: (typeof productImages)[0]) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    
    <a  href={img.href}
      onMouseEnter={() => {
        setHovered(true);
        onHover(img);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onLeave();
      }}
      style={{
        ...style,
        position: "absolute",
        boxShadow: hovered
          ? "0 20px 48px rgba(0,44,91,0.22)"
          : "0 6px 24px rgba(0,44,91,0.10)",
        transform: hovered ? "scale(1.06)" : "scale(1)",
        transition: "box-shadow 0.35s ease, transform 0.35s ease",
        borderRadius: "14px",
        overflow: "hidden",
        display: "block",
        cursor: "pointer",
        zIndex: hovered ? 20 : 1,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img
          src={img.default}
          alt={img.label}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.4s ease",
            opacity: hovered ? 0 : 1,
          }}
        />
        <img
          src={img.hover}
          alt={img.label + " hover"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.4s ease",
            opacity: hovered ? 1 : 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "10px 12px 8px",
            background:
              "linear-gradient(to top, rgba(0,44,91,0.75) 0%, transparent 100%)",
            fontFamily: "'Mulish', sans-serif",
            fontWeight: 700,
            fontSize: "13px",
            color: "#fff",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          {img.label} →
        </div>
      </div>
    </a>
  );
}

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);
  const [activeImg, setActiveImg] = useState<(typeof productImages)[0] | null>(null);

  useEffect(() => {
    const wrap = containerRef.current;
    if (!wrap) return;

    let cx = 0, cy = 0, tx = 0, ty = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      cx = e.clientX - r.left - r.width / 2;
      cy = e.clientY - r.top - r.height / 2;
    };

    const onLeave = () => { cx = 0; cy = 0; };

    const animate = () => {
      tx += (cx - tx) * 0.06;
      ty += (cy - ty) * 0.06;
      layersRef.current.forEach((el, i) => {
        if (el) {
          el.style.transform = `translate(${tx * depths[i]}px, ${ty * depths[i]}px)`;
        }
      });
      raf = requestAnimationFrame(animate);
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    animate();

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#f0f4f8",
      }}
    >
      {/* Heading */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "72px 24px 0",
          maxWidth: "720px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.15,
            color: "#002c5b",
            margin: "0 0 16px",
            textShadow: "0 0 32px rgba(255,255,255,0.9)",
          }}
        >
          Our Products, Built for Excellence
        </h1>
        <p
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontWeight: 400,
            fontSize: "17px",
            color: "#002c5b",
            opacity: 0.65,
            margin: 0,
          }}
        >
          Discover cutting-edge products crafted with precision and innovation.
        </p>
      </div>

      {/* Center preview image */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "40px",
          width: "520px",
          maxWidth: "90vw",
          height: "340px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: activeImg
            ? "0 24px 64px rgba(0,44,91,0.18)"
            : "0 4px 24px rgba(0,44,91,0.07)",
          transition: "box-shadow 0.4s ease",
          background: "#dde4ed",
        }}
      >
        {/* Placeholder when no hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            opacity: activeImg ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px dashed rgba(0,44,91,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,44,91,0.4)" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: "14px",
              color: "rgba(0,44,91,0.45)",
              fontWeight: 600,
            }}
          >
            Hover a product to preview
          </span>
        </div>

        {/* Active hover image */}
        {productImages.map((img) => (
          <div
            key={img.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: activeImg?.id === img.id ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <img
              src={img.hover}
              alt={img.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px 24px 20px",
                background:
                  "linear-gradient(to top, rgba(0,44,91,0.85) 0%, transparent 100%)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Mulish', sans-serif",
                  fontWeight: 800,
                  fontSize: "18px",
                  color: "#fff",
                  margin: 0,
                }}
              >
                {img.label}
              </p>
              <p
                style={{
                  fontFamily: "'Mulish', sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.75)",
                  margin: "4px 0 0",
                }}
              >
                Click to explore →
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Parallax image layers */}
      {positions.map((pos, layerIdx) => (
        <div
          key={layerIdx}
          ref={(el) => {
            if (el) layersRef.current[layerIdx] = el;
          }}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            willChange: "transform",
          }}
        >
          {pos.map((style, imgIdx) => {
            const imgIndex = layerIdx * 2 + imgIdx;
            const img = productImages[imgIndex];
            if (!img) return null;
            return (
              <div key={imgIdx} style={{ pointerEvents: "auto" }}>
                <ParallaxImage
                  img={img}
                  style={style}
                  onHover={(img) => setActiveImg(img)}
                  onLeave={() => setActiveImg(null)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}