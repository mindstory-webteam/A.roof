'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 16 16"
    fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true"
  >
    <line x1="3" y1="13" x2="13" y2="3" />
    <polyline points="5 3 13 3 13 11" />
  </svg>
);

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
  gif?: string;
  video?: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  scrollThreshold?: number;
}

// ── Video bg ──────────────────────────────────────────────────────────────────
const VideoBg: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (src) {
      if (el.getAttribute('data-src') !== src) {
        el.setAttribute('data-src', src);
        el.src = src;
        el.load();
      }
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [src]);
  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      muted loop playsInline
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        opacity: src ? 0.28 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 0,
      }}
    />
  );
};

const MediaBg: React.FC<{ gif: string; video: string }> = ({ gif, video }) => (
  <>
    {!video && (
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: gif ? `url(${gif})` : 'none',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: gif ? 0.28 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none', borderRadius: 'inherit', zIndex: 0,
      }} />
    )}
    <VideoBg src={video} />
  </>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const CardNav: React.FC<CardNavProps> = ({
  logo, logoAlt = 'Logo', items, className = '',
  ease = 'power3.out', baseColor = '#fff', menuColor, scrollThreshold = 80,
}) => {

  // ── scroll ────────────────────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > scrollThreshold);
    fn(); // run once on mount so SSR->hydration is correct
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [scrollThreshold]);

  // ── top-bar dropdowns ─────────────────────────────────────────────────────
  const [activeTop, setActiveTop] = useState<number | null>(null);
  const topTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [topMedia, setTopMedia]   = useState<{ gif: string; video: string }[]>([]);

  const topIn  = (i: number) => { if (topTimer.current) clearTimeout(topTimer.current); setActiveTop(i); };
  const topOut = ()          => { topTimer.current = setTimeout(() => setActiveTop(null), 130); };
  const topStay = ()         => { if (topTimer.current) clearTimeout(topTimer.current); };
  const topLinkIn  = (i: number, gif?: string, video?: string) =>
    setTopMedia(p => { const n = [...p]; n[i] = { gif: gif||'', video: video||'' }; return n; });
  const topLinkOut = (i: number) =>
    setTopMedia(p => { const n = [...p]; n[i] = { gif:'', video:'' }; return n; });

  // ── pill ──────────────────────────────────────────────────────────────────
  const [pillOpen, setPillOpen]       = useState(false);
  const [pillExpanded, setPillExpanded] = useState(false);
  const [pillMedia, setPillMedia]     = useState<{ gif: string; video: string }[]>([]);

  const pillWrapRef  = useRef<HTMLDivElement | null>(null);
  const pillNavRef   = useRef<HTMLDivElement | null>(null);
  const pillCardsRef = useRef<HTMLDivElement[]>([]);
  const pillTlRef    = useRef<gsap.core.Timeline | null>(null);

  const PILL_W   = '90%';
  const PILL_MAX = '1000px';

  // height of the expanded pill (desktop = fixed 280px tall card area)
  const calcHeight = () => {
    const isMob = window.matchMedia('(max-width: 768px)').matches;
    if (!isMob) return 280 + 60; // 60px top bar + 280px cards
    // mobile: measure stacked cards
    const content = pillNavRef.current?.querySelector('.pcontent') as HTMLElement | null;
    if (!content) return 380;
    const saved = { v: content.style.visibility, pe: content.style.pointerEvents, p: content.style.position, h: content.style.height };
    Object.assign(content.style, { visibility:'visible', pointerEvents:'auto', position:'static', height:'auto' });
    void content.offsetHeight;
    const h = 60 + content.scrollHeight + 12;
    Object.assign(content.style, { visibility: saved.v, pointerEvents: saved.pe, position: saved.p, height: saved.h });
    return h;
  };

  const buildTl = () => {
    const nav  = pillNavRef.current;
    const wrap = pillWrapRef.current;
    if (!nav || !wrap) return null;

    // reset everything to closed state
    gsap.set(wrap, { width: '340px', maxWidth: '560px' });
    gsap.set(nav,  { height: 60, borderRadius: 999, overflow: 'hidden' });
    gsap.set(pillCardsRef.current.filter(Boolean), { y: 36, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    // 1. widen pill wrapper
    tl.to(wrap, { width: PILL_W, maxWidth: PILL_MAX, duration: 0.32, ease });

    // 2. grow height + soften corners — overlaps with #1
    tl.to(nav, {
      height: calcHeight,
      borderRadius: 22,
      overflow: 'hidden', // keep hidden so cards don't poke out during animation
      duration: 0.38, ease,
    }, '-=0.16');

    // 3. stagger cards in
    tl.to(pillCardsRef.current.filter(Boolean), {
      y: 0, opacity: 1, duration: 0.32, ease, stagger: 0.06,
    }, '-=0.2');

    // 4. once fully open, allow overflow so dropdowns etc. work
    tl.set(nav, { overflow: 'visible' });

    return tl;
  };

  // build timeline once
  useLayoutEffect(() => {
    // small delay so refs are attached
    const id = setTimeout(() => {
      pillTlRef.current?.kill();
      pillTlRef.current = buildTl();
    }, 50);
    return () => { clearTimeout(id); pillTlRef.current?.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  // rebuild on resize
  useLayoutEffect(() => {
    const fn = () => {
      pillTlRef.current?.kill();
      const tl = buildTl();
      pillTlRef.current = tl;
      if (pillExpanded && tl) tl.progress(1);
    };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pillExpanded]);

  const togglePill = () => {
    const tl = pillTlRef.current;
    if (!tl) return;
    if (!pillExpanded) {
      setPillOpen(true);
      setPillExpanded(true);
      tl.play(0);
    } else {
      setPillOpen(false);
      tl.eventCallback('onReverseComplete', () => {
        setPillExpanded(false);
        // reset nav overflow after close
        if (pillNavRef.current) gsap.set(pillNavRef.current, { overflow: 'hidden' });
      });
      tl.reverse();
    }
  };

  const setPillRef = (i: number) => (el: HTMLDivElement | null) => { if (el) pillCardsRef.current[i] = el; };

  const pillIn  = (i: number, gif?: string, video?: string) =>
    setPillMedia(p => { const n=[...p]; n[i]={gif:gif||'',video:video||''}; return n; });
  const pillOut = (i: number) =>
    setPillMedia(p => { const n=[...p]; n[i]={gif:'',video:''}; return n; });

  // ── shared Card ───────────────────────────────────────────────────────────
  const Card = ({
    item, idx, media, cardRef, onEnter, onLeave,
  }: {
    item: CardNavItem; idx: number;
    media: { gif: string; video: string };
    cardRef?: (el: HTMLDivElement | null) => void;
    onEnter: (gif?: string, video?: string) => void;
    onLeave: () => void;
  }) => (
    <div
      ref={cardRef}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        gap: 8, padding: '14px 18px', borderRadius: 14,
        backgroundColor: item.bgColor, color: item.textColor,
        overflow: 'hidden', userSelect: 'none', flex: '1 1 0%', minWidth: 0,
      }}
    >
      <MediaBg gif={media.gif} video={media.video} />
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:6, height:'100%' }}>
        <div style={{ fontWeight:500, letterSpacing:'-0.4px', fontSize:18 }}>{item.label}</div>
        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:4 }}>
          {item.links?.map((lnk, i) => (
            <a key={i} href={lnk.href} aria-label={lnk.ariaLabel}
              style={{ color:item.textColor, textDecoration:'none', fontSize:14, display:'inline-flex', alignItems:'center', gap:6, opacity:1, transition:'opacity 0.18s', cursor:'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity='0.65'; onEnter(lnk.gif, lnk.video); }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity='1'; onLeave(); }}
            >
              <ArrowUpRight /> {lnk.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══ TOP BAR ═══════════════════════════════════════════════════════ */}
      <div style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        backgroundColor: baseColor,
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        transition: 'transform 0.45s cubic-bezier(.4,0,.2,1), opacity 0.4s',
        transform: scrolled ? 'translateY(-100%)' : 'translateY(0)',
        opacity: scrolled ? 0 : 1,
        pointerEvents: scrolled ? 'none' : 'auto',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <img src={logo} alt={logoAlt} style={{ height:28 }} />
          <nav style={{ display:'flex', alignItems:'center', gap:4 }} aria-label="Main navigation">
            {(items||[]).slice(0,3).map((item, idx) => (
              <div key={idx} style={{ position:'relative' }}
                onMouseEnter={() => topIn(idx)} onMouseLeave={topOut}>
                <button type="button" style={{
                  display:'flex', alignItems:'center', gap:6, padding:'8px 16px',
                  borderRadius:10, fontSize:15, fontWeight:500, cursor:'pointer',
                  border:'none', background:'transparent', color: menuColor||'#111',
                }} aria-expanded={activeTop===idx} aria-haspopup="true">
                  {item.label}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                    style={{ transition:'transform 0.2s', transform: activeTop===idx ? 'rotate(180deg)' : 'none' }}>
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div style={{
                  position:'absolute', top:'calc(100% + 10px)', left:0,
                  minWidth:210, borderRadius:14,
                  boxShadow:'0 8px 32px rgba(0,0,0,0.15)',
                  transition:'opacity 0.2s, transform 0.2s',
                  transformOrigin:'top left',
                  opacity: activeTop===idx ? 1 : 0,
                  transform: activeTop===idx ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-6px)',
                  pointerEvents: activeTop===idx ? 'auto' : 'none',
                  zIndex:200, overflow:'hidden',
                }} onMouseEnter={topStay} onMouseLeave={topOut}>
                  <Card item={item} idx={idx}
                    media={topMedia[idx]||{gif:'',video:''}}
                    onEnter={(g,v)=>topLinkIn(idx,g,v)}
                    onLeave={()=>topLinkOut(idx)} />
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* ══ PILL NAV ══════════════════════════════════════════════════════ */}
      <div
        ref={pillWrapRef}
        className={className}
        style={{
          position:'fixed', zIndex:100,
          left:'50%', transform:'translateX(-50%)',
          width:'340px', maxWidth:'560px',   // GSAP will animate this
          top: scrolled ? 14 : -120,
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
          transition:'top 0.45s cubic-bezier(.4,0,.2,1), opacity 0.4s',
        }}
      >
        <nav
          ref={pillNavRef}
          style={{
            display:'block', height:60, padding:0,
            borderRadius:999,
            boxShadow:'0 4px 28px rgba(0,0,0,0.13)',
            position:'relative',
            willChange:'height, border-radius',
            backgroundColor: baseColor,
            overflow:'hidden',              // GSAP controls overflow
          }}
        >
          {/* top bar inside pill */}
          <div style={{
            position:'absolute', left:0, right:0, top:0,
            height:60, display:'flex',
            alignItems:'center', justifyContent:'space-between',
            padding:'0 20px', zIndex:10,    // high z so it's always clickable
          }}>
            <img src={logo} alt={logoAlt} style={{ height:26 }} />

            <button
              type="button"
              onClick={togglePill}
              aria-label={pillExpanded ? 'Close menu' : 'Open menu'}
              aria-expanded={pillExpanded}
              style={{
                display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                gap:6, width:40, height:40,
                cursor:'pointer', border:'none',
                background:'transparent', padding:0,
                // ensure button is always on top and receives clicks
                position:'relative', zIndex:20,
              }}
            >
              <span style={{
                display:'block', width:22, height:1.5,
                backgroundColor: menuColor||'#111',
                transition:'transform 0.28s', transformOrigin:'50% 50%',
                transform: pillOpen ? 'translateY(3.75px) rotate(45deg)' : 'none',
              }} />
              <span style={{
                display:'block', width:22, height:1.5,
                backgroundColor: menuColor||'#111',
                transition:'transform 0.28s', transformOrigin:'50% 50%',
                transform: pillOpen ? 'translateY(-3.75px) rotate(-45deg)' : 'none',
              }} />
            </button>
          </div>

          {/* cards */}
          <div
            className="pcontent"
            aria-hidden={!pillExpanded}
            style={{
              position:'absolute', left:0, right:0, top:60, bottom:0,
              padding:8,
              display:'flex',
              flexDirection:'row',
              gap:8, alignItems:'stretch', zIndex:1,
              visibility: pillExpanded ? 'visible' : 'hidden',
              pointerEvents: pillExpanded ? 'auto' : 'none',
            }}
          >
            {(items||[]).slice(0,3).map((item, idx) => (
              <Card key={idx} item={item} idx={idx}
                media={pillMedia[idx]||{gif:'',video:''}}
                cardRef={setPillRef(idx)}
                onEnter={(g,v)=>pillIn(idx,g,v)}
                onLeave={()=>pillOut(idx)} />
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default CardNav;