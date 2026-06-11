"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface CTASectionProps {
  backgroundImage?: string;
  overlayOpacity?: number;
}

const CTASection = ({
  backgroundImage = "/nav-video/roof_rain_animation.gif",
  overlayOpacity = 0.62,
}: CTASectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewH) return;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      setOffsetY((progress - 0.5) * 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.25 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,700;0,800;0,900;1,800;1,900&display=swap');

        .cta-section {
          font-family: 'Mulish', sans-serif;
          position: relative;
          overflow: hidden;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Background ── */
        .cta-bg {
          position: absolute;
          inset: -12% 0;
          background-size: cover;
          background-position: center;
          background-color: #0d1a0d;
          will-change: transform;
        }

        /* ── Overlay: dark base + subtle vignette ── */
        .cta-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .cta-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 110% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.45) 100%);
          pointer-events: none;
        }

        /* ── Content ── */
        .cta-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 80px 48px;
          max-width: 720px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .cta-content.visible { opacity: 1; transform: translateY(0); }

        /* ── Eyebrow ── */
        .cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 20px;
        }
        .cta-eyebrow::before {
          content: '';
          width: 26px; height: 2px;
          background: #1d6fbf;
          border-radius: 99px;
          display: block;
        }

        /* ── Heading — white + blue italic ── */
        .cta-heading {
          font-size: 55px;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.06;
          color: #ffffff;
          margin: 0 0 36px;
          display: flex;
          
        }
        .cta-heading-blue {
          display: block;
          color: #1d6fbf;
          font-style: italic;
        }

        /* ── Buttons ── */
        .cta-btns {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cta-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 15px 32px;
          border-radius: 10px;
          background: #ffffff;
          color: #0d1117;
          font-family: 'Mulish', sans-serif;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }
        .cta-btn-primary:hover {
          background: #1d6fbf;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(29,111,191,0.35);
        }
        .cta-btn-primary:hover svg path { stroke: #ffffff; }
        .cta-btn-primary svg { transition: transform 0.2s ease; }
        .cta-btn-primary:hover svg { transform: translateX(3px); }

        .cta-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 15px 28px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.80);
          font-family: 'Mulish', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.03em;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
          backdrop-filter: blur(4px);
        }
        .cta-btn-ghost:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.45);
          color: #ffffff;
          transform: translateY(-2px);
        }

        @media (max-width: 520px) {
          .cta-content { padding: 64px 24px; }
          .cta-btns { flex-direction: column; }
          .cta-btn-primary, .cta-btn-ghost { width: 100%; justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-content { transition: none; }
        }
      `}</style>

      <section ref={sectionRef} className="cta-section" aria-label="A-Roof — Get a quote">

        {/* Bg image + parallax */}
        <div
          className="cta-bg"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            transform: `translateY(${offsetY}px)`,
          }}
        />

        {/* Dark overlay */}
        <div
          className="cta-overlay"
          aria-hidden="true"
          style={{ backgroundColor: `rgba(8,12,8,${overlayOpacity})` }}
        />

        {/* Vignette */}
        <div className="cta-vignette" aria-hidden="true" />

        {/* Content */}
        <div className={`cta-content${visible ? " visible" : ""}`}>
          <p className="cta-eyebrow">Built for the long run</p>

          <h2 className="cta-heading">
            Ready to roof  smarter?
            {/* <span className="cta-heading-blue">Get an expert quote today.</span> */}
          </h2>

          <div className="cta-btns">
            <Link href="/contact" className="cta-btn-primary">
              Get a Free Quote
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="#0d1117" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/products/traffer-upvc" className="cta-btn-ghost">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;