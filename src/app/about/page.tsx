
import AboutSection from "@/components/AboutSectionAlt";
import BlogSection from "@/components/BlogSection";
import CardNav from "@/components/Cardnav";
import CTASection from "@/components/CTASection";

import Footer from "@/components/Footer";
import ProductDetailsSection from "@/components/ProductDetailsSection";

import VideoBreadcrumbSection from "@/components/VideoBreadcrumbSection";

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
        video: '/prodect/steel-roof.mp4',   // ← mp4 goes in video field
      },
      {
        label: 'Tile UPVC Sheet',
        href: 'tile-upvc-sheet',
        ariaLabel: 'View Tile UPVC Sheet',
        video: '/prodect/tile-roof.mp4',    // ← mp4 goes in video field
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
        scrollThreshold={80}
      />
      <VideoBreadcrumbSection
        videoSrc="/videos/brcm.mp4"
        title="About Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
        bottomLink={{ label: "Back to home", href: "/" }}
      />
      <AboutSection/>
      <ProductDetailsSection/>
      <BlogSection/>
      <CTASection/>
      <Footer/>
    </div> 
  );
}