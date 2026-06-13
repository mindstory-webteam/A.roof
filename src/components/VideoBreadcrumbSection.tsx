import React from "react";

/**
 * VideoBreadcrumbSection
 * ----------------------
 * A full-width section with a looping video background, an overlay,
 * a breadcrumb trail, a page title, and a link anchored to the
 * bottom-left corner of the section.
 *
 * Usage:
 * <VideoBreadcrumbSection
 *   videoSrc="/videos/hero.mp4"
 *   title="Our Services"
 *   breadcrumbs={[
 *     { label: "Home", href: "/" },
 *     { label: "Services" },
 *   ]}
 *   bottomLink={{ label: "Back to home", href: "/" }}
 * />
 *
 * Notes:
 * - Replace `videoSrc` with the path/URL to your own video file.
 * - `poster` is optional but recommended for a smoother first paint.
 * - Requires Tailwind CSS to be set up in your project.
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BottomLink {
  label: string;
  href: string;
}

interface VideoBreadcrumbSectionProps {
  videoSrc: string;
  poster?: string;
  title: string;
  breadcrumbs: BreadcrumbItem[];
  bottomLink: BottomLink;
  /** Tailwind height classes for the section, e.g. "h-[50vh]" */
  height?: string;
}

export default function VideoBreadcrumbSection({
  videoSrc,
  poster,
  title,
  breadcrumbs,
  bottomLink,
  height = "h-[60vh] min-h-[500px]",
}: VideoBreadcrumbSectionProps) {
  return (
    <section className={`relative w-full ${height} overflow-hidden`}>
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 " />

      {/* Content layer */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 sm:px-10">
        {/* Breadcrumb + Title */}
        <div>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-white/80">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={index} className="flex items-center">
                    {item.href && !isLast ? (
                      <a
                        href={item.href}
                        className="transition-colors hover:text-white"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span
                        className="text-white"
                        aria-current={isLast ? "page" : undefined}
                      >
                        {item.label}
                      </span>
                    )}
                    {!isLast && (
                      <span className="mx-2 text-white/50">/</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
            {title}
          </h1> */}
        </div>

        {/* Bottom-left link */}
        <div>
          <a
            href={bottomLink.href}
            className="inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4 transition-colors hover:text-white/80 sm:text-base"
          >
            {bottomLink.label}
          </a>
        </div>
      </div>
    </section>
  );
}