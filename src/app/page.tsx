import AboutSection from "@/components/AboutSection";
import ARoofScrollSection from "@/components/ARoofScrollSection";

import CardNav from "@/components/Cardnav";
import DualVideoSection from "@/components/DualVideoSection";

import RoofScrollAd from "@/components/Roofscrollad";

const NAV_ITEMS = [
  {
    label: 'About',
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
    links: [
      {
        label: 'Who We Are',
        href: '/about',
        ariaLabel: 'Learn who we are',
        gif: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
      },
      {
        label: 'Why Us',
        href: '/why-us',
        ariaLabel: 'Discover why us',
        gif: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
      },
    ],
  },
  {
    label: 'Products',
    bgColor: '#16213e',
    textColor: '#ffffff',
    links: [
      {
        label: 'Traffer UPVC Sheet',
        href: '/products/traffer-upvc',
        ariaLabel: 'View Traffer UPVC Sheet',
        gif: '/nav-video/roof_rain_animation.gif',
      },
      {
        label: 'Tile UPVC Sheet',
        href: '/products/tile-upvc',
        ariaLabel: 'View Tile UPVC Sheet',
        gif: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
      },
      {
        label: 'Specification',
        href: '/products/specification',
        ariaLabel: 'View specifications',
        gif: 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif',
      },
    ],
  },
  {
    label: 'Installation',
    bgColor: '#0f3460',
    textColor: '#ffffff',
    links: [
      {
        label: 'Installation Guide',
        href: '/installation',
        ariaLabel: 'See installation guide',
        gif: 'https://media.giphy.com/media/l4FGGafcOHmrlQxG0/giphy.gif',
      },
      {
        label: 'Comparison',
        href: '/comparison',
        ariaLabel: 'Compare products',
        gif: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
      },
    ],
  },
];

export default function Home() {
  return (
    <div>
      <CardNav
        logo="/logo/arooflogo.png"
        items={NAV_ITEMS}
        baseColor="#ffffff"
        menuColor="#000000"
        buttonBgColor="#1a1a2e"
        buttonTextColor="#ffffff"
      />
      <RoofScrollAd />
      <AboutSection/>
     
      <ARoofScrollSection/>
      <DualVideoSection/>
     
    </div>
  );
}