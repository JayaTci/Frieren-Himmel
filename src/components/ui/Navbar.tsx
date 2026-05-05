"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "Journey",  href: "#hero" },
  { label: "Cinematic", href: "#cinematic" },
  { label: "Memories",  href: "#systems" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Use a sentinel div just below the fold so we fire once, not on every px
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) {
      // Fallback: scroll listener if sentinel not in DOM yet
      const onScroll = () => setScrolled(window.scrollY > 40);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/60 backdrop-blur-2xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-sans text-[13px] font-semibold tracking-[0.16em] text-foreground"
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(159,220,200,0.9)]"
          />
          Himmel & Frieren
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Site sections">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-sans text-[13px] tracking-[0.14em] text-zinc-300 transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#systems"
            className="group inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-[rgba(7,24,22,0.34)] px-4 py-2 font-sans text-[13px] font-medium tracking-[0.12em] text-foreground backdrop-blur-md transition-all duration-200 hover:bg-white/[0.1] active:translate-y-[1px]"
          >
            Begin
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-foreground transition-colors hover:bg-white/[0.12] md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={16} weight="bold" /> : <List size={16} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav
          className="border-b border-white/8 bg-background/95 backdrop-blur-md md:hidden"
          aria-label="Mobile site sections"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-6 py-3.5 font-sans text-[13px] tracking-[0.14em] text-zinc-300 transition-colors hover:text-foreground"
            >
              <span aria-hidden className="h-px w-4 bg-accent/50" />
              {label}
            </a>
          ))}
          <a
            href="#farewell"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-6 py-3.5 font-sans text-[13px] tracking-[0.14em] text-zinc-300 transition-colors hover:text-foreground"
          >
            <span aria-hidden className="h-px w-4 bg-accent/50" />
            Farewell
          </a>
        </nav>
      )}

      {/* Sentinel observed by IntersectionObserver — sits 80px below the fold */}
      <div ref={sentinelRef} id="nav-sentinel" className="absolute top-20 h-px w-px" aria-hidden="true" />
    </header>
  );
}
