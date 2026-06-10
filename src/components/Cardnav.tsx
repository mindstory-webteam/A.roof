'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Inline arrow icon — no react-icons dependency needed
const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="3" y1="13" x2="13" y2="3" />
    <polyline points="5 3 13 3 13 11" />
  </svg>
);

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
  gif?: string; // GIF URL shown in card background on hover
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
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // hoveredGif[cardIdx] = currently-hovered GIF URL (or '' if none)
  const [hoveredGif, setHoveredGif] = useState<string[]>([]);

  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // ── height calculation ─────────────────────────────────────────────────────
  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisibility = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        void contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisibility;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  // ── timeline ──────────────────────────────────────────────────────────────
  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease });
    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      '-=0.1',
    );
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  // ── toggle ────────────────────────────────────────────────────────────────
  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  // ── GIF hover handlers ────────────────────────────────────────────────────
  // Each card independently tracks which link (if any) is hovered,
  // and shows that link's GIF as a background overlay on the card.
  const handleLinkEnter = (cardIdx: number, gif?: string) => {
    if (!gif) return;
    setHoveredGif((prev) => {
      const next = [...prev];
      next[cardIdx] = gif;
      return next;
    });
  };

  const handleLinkLeave = (cardIdx: number) => {
    setHoveredGif((prev) => {
      const next = [...prev];
      next[cardIdx] = '';
      return next;
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`card-nav-container absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-xl shadow-md relative will-change-[height] ${isExpanded ? 'overflow-visible' : 'overflow-hidden'}`}
        style={{ backgroundColor: baseColor }}
      >
        {/* ── Top bar ── */}
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          {/* Hamburger */}
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
              } group-hover:opacity-75`}
            />
          </div>

          {/* Logo */}
          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none bg-black">
            <img src={logo} alt={logoAlt} className="logo h-[28px]" />
          </div>

          {/* CTA button */}
          <button
            type="button"
            className="card-nav-cta-button hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 items-center h-full font-medium cursor-pointer transition-colors duration-300"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Get Started
          </button>
        </div>

        {/* ── Cards content ── */}
        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => {
            const activeGif = hoveredGif[idx] || '';

            return (
              <div
                key={`${item.label}-${idx}`}
                className="nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%] overflow-hidden"
                ref={setCardRef(idx)}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                {/* ── GIF background layer ── */}
                {/*
                  The GIF fades in/out via opacity transition.
                  We always render the div so the transition is smooth;
                  when there's no activeGif the opacity is 0.
                */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: activeGif ? `url(${activeGif})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: activeGif ? 0.22 : 0,
                    transition: 'opacity 0.35s ease',
                    pointerEvents: 'none',
                    borderRadius: 'inherit',
                    zIndex: 0,
                  }}
                />

                {/* ── Card content (sits above GIF layer) ── */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    height: '100%',
                  }}
                >
                  <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                    {item.label}
                  </div>

                  <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                    {item.links?.map((lnk, i) => (
                      <a
                        key={`${lnk.label}-${i}`}
                        className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                        href={lnk.href}
                        aria-label={lnk.ariaLabel}
                        onMouseEnter={() => handleLinkEnter(idx, lnk.gif)}
                        onMouseLeave={() => handleLinkLeave(idx)}
                      >
                        <ArrowUpRight className="nav-card-link-icon shrink-0" />
                        {lnk.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;


// ─── Usage example ────────────────────────────────────────────────────────────
//
// import CardNav from './CardNav';
//
// const NAV_ITEMS: CardNavItem[] = [
//   {
//     label: 'About',
//     bgColor: '#1a1a2e',
//     textColor: '#ffffff',
//     links: [
//       {
//         label: 'Who We Are',
//         href: '/about',
//         ariaLabel: 'Learn who we are',
//         gif: 'https://media.giphy.com/media/YOUR_WHO_WE_ARE_GIF/giphy.gif',
//       },
//       {
//         label: 'Why Us',
//         href: '/why-us',
//         ariaLabel: 'Discover why us',
//         gif: 'https://media.giphy.com/media/YOUR_WHY_US_GIF/giphy.gif',
//       },
//     ],
//   },
//   {
//     label: 'Products',
//     bgColor: '#16213e',
//     textColor: '#ffffff',
//     links: [
//       {
//         label: 'Traffer UPVC Sheet',
//         href: '/products/traffer-upvc',
//         ariaLabel: 'View Traffer UPVC Sheet',
//         gif: 'https://media.giphy.com/media/YOUR_TRAFFER_GIF/giphy.gif',
//       },
//       {
//         label: 'Tile UPVC Sheet',
//         href: '/products/tile-upvc',
//         ariaLabel: 'View Tile UPVC Sheet',
//         gif: 'https://media.giphy.com/media/YOUR_TILE_GIF/giphy.gif',
//       },
//       {
//         label: 'Specification',
//         href: '/products/specification',
//         ariaLabel: 'View specifications',
//         gif: 'https://media.giphy.com/media/YOUR_SPEC_GIF/giphy.gif',
//       },
//     ],
//   },
//   {
//     label: 'Installation',
//     bgColor: '#0f3460',
//     textColor: '#ffffff',
//     links: [
//       {
//         label: 'Installation Guide',
//         href: '/installation',
//         ariaLabel: 'See installation guide',
//         gif: 'https://media.giphy.com/media/YOUR_INSTALL_GIF/giphy.gif',
//       },
//       {
//         label: 'Comparison',
//         href: '/comparison',
//         ariaLabel: 'Compare products',
//         gif: 'https://media.giphy.com/media/YOUR_COMPARE_GIF/giphy.gif',
//       },
//     ],
//   },
// ];
//
// <CardNav
//   logo="/logo.svg"
//   items={NAV_ITEMS}
//   baseColor="#ffffff"
//   menuColor="#000000"
//   buttonBgColor="#1a1a2e"
//   buttonTextColor="#ffffff"
// />