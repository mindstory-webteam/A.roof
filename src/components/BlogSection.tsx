"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BlogPost {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const posts: BlogPost[] = [
  {
    slug: "why-asa-coating-outlasts-steel",
    tag: "Technology",
    title: "Why ASA Coating Outlasts Traditional Steel Roofing by Decades",
    excerpt:
      "ASA (Acrylonitrile Styrene Acrylate) isn't just a coating — it's a molecular shield. We break down the science behind why A-Roof sheets retain colour and strength long after steel has rusted.",
    date: "May 28, 2025",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "installation-guide-tile-upvc",
    tag: "Installation",
    title: "Step-by-Step Installation Guide for Tile UPVC Sheets",
    excerpt:
      "From purlin spacing to ridge capping, our field-tested installation guide covers everything a contractor needs for a watertight Tile UPVC roof.",
    date: "May 14, 2025",
    readTime: "7 min read",
  },
  {
    slug: "kerala-monsoon-roofing",
    tag: "Climate",
    title: "Roofing for Kerala's Monsoon: What Actually Works",
    excerpt:
      "150+ cm of annual rainfall demands more than a standard roof. We compare how UPVC, steel, and asphalt shingles perform under Kerala's relentless downpours.",
    date: "Apr 30, 2025",
    readTime: "6 min read",
  },
  {
    slug: "colour-retention-uv-test",
    tag: "Testing",
    title: "50 Years of Colour Retention — Our UV Accelerated Test Results",
    excerpt:
      "We put A-Roof sheets through 3,000 hours of UV accelerated weathering.",
    date: "Apr 12, 2025",
    readTime: "4 min read",
  },
  {
    slug: "trafford-vs-tile",
    tag: "Products",
    title: "Trafford vs Tile UPVC Sheet: How to Choose the Right Profile",
    excerpt:
      "Both share the same ASA-coated UPVC core, but serve very different buildings.",
    date: "Mar 22, 2025",
    readTime: "5 min read",
  },
];

const TAGS = ["All", "Technology", "Installation", "Climate", "Testing", "Products"];

const TAG_COLOR: Record<string, string> = {
  Technology: "#1d6fbf",
  Installation: "#0e7a55",
  Climate: "#b45309",
  Testing: "#6d28d9",
  Products: "#0d1117",
};
const TAG_BG: Record<string, string> = {
  Technology: "rgba(29,111,191,0.08)",
  Installation: "rgba(14,122,85,0.08)",
  Climate: "rgba(180,83,9,0.08)",
  Testing: "rgba(109,40,217,0.08)",
  Products: "rgba(13,17,23,0.07)",
};

const PlaceholderImg = ({ tag, large }: { tag: string; large?: boolean }) => {
  const bg: Record<string, string> = {
    Technology: "linear-gradient(135deg,#dbeafe 0%,#eff6ff 100%)",
    Installation: "linear-gradient(135deg,#d1fae5 0%,#f0fdf4 100%)",
    Climate: "linear-gradient(135deg,#fef3c7 0%,#fffbeb 100%)",
    Testing: "linear-gradient(135deg,#ede9fe 0%,#f5f3ff 100%)",
    Products: "linear-gradient(135deg,#f1f5f9 0%,#f8fafc 100%)",
  };
  return (
    <div style={{ width: "100%", height: "100%", background: bg[tag] ?? "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: large ? 12 : 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: TAG_COLOR[tag] ?? "#9ca3af", fontWeight: 800, opacity: 0.4 }}>
        {tag}
      </span>
    </div>
  );
};

const BlogSection = () => {
  const [activeTag, setActiveTag] = useState("All");
  const filtered = activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);
  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p.slug !== featured?.slug).slice(0, 4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700;1,800;1,900&display=swap');

        .blog-wrap {
          font-family: 'Mulish', sans-serif;
          background: #f8f9fb;
          width: 100%;
          overflow: hidden;
        }
        .blog-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 88px 64px 100px;
        }

        /* ── Eyebrow ── */
        .blog-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #1d6fbf;
          margin-bottom: 16px;
        }
        .blog-eyebrow::before {
          content: '';
          width: 28px; height: 2.5px;
          background: #1d6fbf;
          border-radius: 99px;
          display: block;
          flex-shrink: 0;
        }

        /* ── Heading — black line + blue italic line ── */
        .blog-heading {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          line-height: 1.06;
          letter-spacing: -0.03em;
          margin: 0 0 16px;
          color: #0d1117;
        }
        .blog-heading-blue {
          display: block;
          color: #1d6fbf;
          font-style: italic;
        }

        .blog-subtext {
          font-size: 15px;
          line-height: 1.72;
          color: #6b7280;
          margin: 0;
          max-width: 480px;
        }

        /* ── Header row ── */
        .blog-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 44px;
          flex-wrap: wrap;
        }

        .blog-view-all {
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #1d6fbf;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border: 1.5px solid rgba(29,111,191,0.22);
          border-radius: 8px;
          background: rgba(29,111,191,0.04);
          transition: background 0.18s, border-color 0.18s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .blog-view-all:hover { background: rgba(29,111,191,0.10); border-color: rgba(29,111,191,0.45); }

        /* ── Tags ── */
        .blog-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 48px; }
        .blog-tag-btn {
          padding: 7px 18px;
          border-radius: 999px;
          border: 1.5px solid #e5e7eb;
          background: #ffffff;
          color: #6b7280;
          font-family: 'Mulish', sans-serif;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
        }
        .blog-tag-btn:hover { border-color: #1d6fbf; color: #1d6fbf; }
        .blog-tag-btn.active { background: #0d1117; border-color: #0d1117; color: #fff; }

        /* ── Grid ── */
        .blog-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }

        /* ── Featured card ── */
        .blog-featured-card {
          border-radius: 16px; overflow: hidden;
          border: 1px solid #eaedf1; background: #ffffff;
          text-decoration: none; display: block;
          transition: box-shadow 0.22s, border-color 0.22s, transform 0.22s;
        }
        .blog-featured-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.10); border-color: #d1d5db; transform: translateY(-2px); }

        .blog-featured-img { height: 300px; position: relative; overflow: hidden; }
        .blog-featured-body { padding: 28px 30px 32px; }

        .blog-featured-title {
          font-size: 20px; font-weight: 900;
          line-height: 1.3; color: #0d1117;
          margin: 0 0 12px; letter-spacing: -0.02em;
        }
        .blog-featured-excerpt {
          font-size: 14px; line-height: 1.72;
          color: #6b7280; margin: 0 0 22px;
        }

        /* ── Small card ── */
        .blog-small-card {
          display: flex; gap: 16px; padding: 18px 20px;
          border-radius: 12px; border: 1px solid #eaedf1;
          background: #ffffff; text-decoration: none;
          align-items: flex-start;
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
        }
        .blog-small-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); border-color: #d1d5db; transform: translateY(-1px); }

        .blog-thumb { width: 76px; height: 76px; border-radius: 8px; overflow: hidden; flex-shrink: 0; border: 1px solid #eaedf1; }

        .blog-small-title { font-size: 14px; font-weight: 800; line-height: 1.38; color: #0d1117; margin: 0 0 8px; letter-spacing: -0.01em; }

        .blog-see-all {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 16px; border-radius: 12px;
          border: 1.5px dashed #d1d5db; background: transparent;
          color: #9ca3af; text-decoration: none;
          font-family: 'Mulish', sans-serif;
          font-size: 13px; font-weight: 800; letter-spacing: 0.03em;
          transition: all 0.18s;
        }
        .blog-see-all:hover { border-color: #1d6fbf; color: #1d6fbf; background: rgba(29,111,191,0.04); }

        .blog-tag-badge {
          display: inline-flex; align-self: flex-start;
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 11px;
          border-radius: 999px; border: 1px solid; margin-bottom: 10px;
        }
        .blog-meta { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 700; color: #9ca3af; }
        .blog-meta-dot { color: #d1d5db; }

        @media (max-width: 900px) {
          .blog-inner { padding: 64px 32px 80px; }
          .blog-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .blog-inner { padding: 52px 20px 64px; }
          .blog-featured-body { padding: 20px; }
        }
      `}</style>

      <section className="blog-wrap" aria-label="A-Roof Blog">
        <div className="blog-inner">

          {/* ── Header ── */}
          <div className="blog-header">
            <div>
              <p className="blog-eyebrow">From the blog</p>
              <h2 className="blog-heading">
                Roofing insights,
                <span className="blog-heading-blue">straight from the field.</span>
              </h2>
            </div>
            <Link href="/blog" className="blog-view-all">
              View all articles
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M8 3l3 3.5-3 3.5" stroke="#1d6fbf" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* ── Tag filter ── */}
          <div className="blog-tags">
            {TAGS.map((tag) => (
              <button key={tag} className={`blog-tag-btn${activeTag === tag ? " active" : ""}`} onClick={() => setActiveTag(tag)}>
                {tag}
              </button>
            ))}
          </div>

          {/* ── Grid ── */}
          {featured && (
            <div className="blog-grid">
              <Link href={`/blog/${featured.slug}`} className="blog-featured-card">
                <div className="blog-featured-img">
                  <PlaceholderImg tag={featured.tag} large />
                </div>
                <div className="blog-featured-body">
                  <span className="blog-tag-badge" style={{ color: TAG_COLOR[featured.tag], backgroundColor: TAG_BG[featured.tag], borderColor: TAG_COLOR[featured.tag] + "33" }}>
                    {featured.tag}
                  </span>
                  <h3 className="blog-featured-title">{featured.title}</h3>
                  <p className="blog-featured-excerpt">{featured.excerpt}</p>
                  <div className="blog-meta">
                    <span>{featured.date}</span>
                    <span className="blog-meta-dot">·</span>
                    <span>{featured.readTime}</span>
                  </div>
                </div>
              </Link>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rest.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-small-card">
                    <div className="blog-thumb"><PlaceholderImg tag={post.tag} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="blog-tag-badge" style={{ color: TAG_COLOR[post.tag], backgroundColor: TAG_BG[post.tag], borderColor: TAG_COLOR[post.tag] + "33" }}>
                        {post.tag}
                      </span>
                      <h4 className="blog-small-title">{post.title}</h4>
                      <div className="blog-meta">
                        <span>{post.date}</span>
                        <span className="blog-meta-dot">·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/blog" className="blog-see-all">
                  Browse all articles
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M8 3l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogSection;