"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#systems"
            className="font-sans text-[13px] tracking-[0.14em] text-zinc-300 transition-colors hover:text-foreground"
          >
            Journey
          </a>
          <a
            href="#footer"
            className="font-sans text-[13px] tracking-[0.14em] text-zinc-300 transition-colors hover:text-foreground"
          >
            Memories
          </a>
        </nav>

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
      </div>
    </header>
  );
}
