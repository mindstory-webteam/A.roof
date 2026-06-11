"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Top divider ── */}
      <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />

      {/* ── Main layout: brand left | columns right ── */}
      <div
        className="footer-main"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '80px 48px 64px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 40,
        }}
      >
        {/* ── Brand block (left) ── */}
        <div style={{ flexShrink: 0, maxWidth: 280 }}>
          {/* Logo placeholder — swap with <Image> when logo asset is ready */}
          

        
          <Image
            src="/logo/arooflogo.png"
            alt="A-Roof Logo"
            width={130}
            height={38}
            style={{ objectFit: 'contain', marginBottom: 20 }}
          />
          

          <p
            style={{
              fontSize: 13,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.38)',
              margin: '0 0 28px',
            }}
          >
            © copyright A-Roof {new Date().getFullYear()}.<br />
            All rights reserved.
          </p>

          <p
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.22)',
              margin: 0,
            }}
          >
            An innovative roofing brand by Aqua Star<br />
            Industries — Ponnore Group, Kerala, India.
          </p>
        </div>

        {/* ── Link columns (right) ── */}
        <div
          className="footer-cols"
          style={{
            display: 'flex',
            gap: '56px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {/* Pages */}
          <div>
            <h4 style={headingStyle}>Pages</h4>
            <ul style={listStyle}>
              <li><FooterLink href="/">Home</FooterLink></li>
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/why-us">Why Us</FooterLink></li>
              <li><FooterLink href="/installation">Installation</FooterLink></li>
              <li><FooterLink href="/comparison">Comparison</FooterLink></li>
              <li><FooterLink href="/blog">Blog</FooterLink></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 style={headingStyle}>Products</h4>
            <ul style={listStyle}>
              <li><FooterLink href="/products/traffer-upvc">Trafford UPVC Sheet</FooterLink></li>
              <li><FooterLink href="/products/tile-upvc">Tile UPVC Sheet</FooterLink></li>
              <li><FooterLink href="/products/specification">Specification</FooterLink></li>
              <li><FooterLink href="/products/colours">Colour Range</FooterLink></li>
              <li><FooterLink href="/products/accessories">Accessories</FooterLink></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 style={headingStyle}>Socials</h4>
            <ul style={listStyle}>
              <li><FooterLink href="https://facebook.com" external>Facebook</FooterLink></li>
              <li><FooterLink href="https://instagram.com" external>Instagram</FooterLink></li>
              <li><FooterLink href="https://youtube.com" external>YouTube</FooterLink></li>
              <li><FooterLink href="https://wa.me/91XXXXXXXXXX" external>WhatsApp</FooterLink></li>
              <li><FooterLink href="https://www.aroof.in" external>aroof.in</FooterLink></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={headingStyle}>Legal</h4>
            <ul style={listStyle}>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/warranty">Warranty</FooterLink></li>
              <li><FooterLink href="/disclaimer">Disclaimer</FooterLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={headingStyle}>Contact</h4>
            <ul style={{ ...listStyle, gap: 16 }}>
              <li>
                <span style={labelStyle}>Address</span>
                <span style={valueStyle}>
                  Aqua Star Industries,<br />
                  Ponnore Group,<br />
                  Kerala, India
                </span>
              </li>
              <li>
                <span style={labelStyle}>Phone</span>
                <FooterLink href="tel:+91XXXXXXXXXX">+91 XXX XXX XXXX</FooterLink>
              </li>
              <li>
                <span style={labelStyle}>Email</span>
                <FooterLink href="mailto:info@aroof.in">info@aroof.in</FooterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.20)' }}>
          A-Roof is a product of Aqua Star Industries — Ponnore Group
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          <FooterLink href="/privacy" small>Privacy Policy</FooterLink>
          <FooterLink href="/terms" small>Terms of Service</FooterLink>
          <FooterLink href="/warranty" small>Warranty</FooterLink>
        </div>
      </div>

      {/* ── Watermark text ── */}
      {/* <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontSize: 'clamp(80px, 16vw, 220px)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.035)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        A-ROOF
      </div> */}

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 1100px) {
          .footer-main {
            flex-direction: column !important;
          }
          .footer-cols {
            justify-content: flex-start !important;
          }
        }
        @media (max-width: 680px) {
          .footer-main {
            padding: 56px 24px 48px !important;
          }
          .footer-cols {
            gap: 40px !important;
          }
          .footer-cols > div {
            min-width: 140px;
          }
        }
        @media (max-width: 420px) {
          .footer-cols {
            flex-direction: column !important;
          }
        }
      `}</style>
    </footer>
  );
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const headingStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '0.01em',
  color: '#ffffff',
  margin: '0 0 22px',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)',
  marginBottom: 4,
};

const valueStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.50)',
  lineHeight: 1.65,
};

// ── FooterLink ────────────────────────────────────────────────────────────────
const FooterLink = ({
  href,
  children,
  external,
  small,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  small?: boolean;
}) => {
  const style: React.CSSProperties = {
    fontSize: small ? 12 : 14,
    color: 'rgba(255,255,255,0.50)',
    textDecoration: 'none',
    transition: 'color 0.15s',
    display: 'inline-block',
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      style={style}
      onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
    >
      {children}
    </Link>
  );
};

export default Footer;