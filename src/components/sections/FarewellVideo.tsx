"use client";

import { useEffect, useRef } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";

/** Full-screen farewell section — last.mp4 autoplays and loops when in view. */
export function FarewellVideo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** Plays the video when the section enters the viewport, pauses when it leaves. */
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="farewell"
      className="relative min-h-screen overflow-hidden border-t border-white/5 bg-background"
    >
      <video
        ref={videoRef}
        src="/source-media/processed-videos/last.mp4"
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />

      {/* Gradient overlay matching the site's dark aesthetic */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,11,0.6) 0%, rgba(10,10,11,0.18) 40%, rgba(10,10,11,0.52) 72%, rgba(10,10,11,0.92) 100%)",
        }}
      />

      {/* Corner HUD decorators */}
      <div className="pointer-events-none absolute left-6 top-24 text-accent md:left-10 md:top-28">
        <HudFrame corner="tl" size={26} />
      </div>
      <div className="pointer-events-none absolute right-6 top-24 text-accent md:right-10 md:top-28">
        <HudFrame corner="tr" size={26} />
      </div>
      <div className="pointer-events-none absolute bottom-14 left-6 text-accent md:bottom-16 md:left-10">
        <HudFrame corner="bl" size={26} />
      </div>
      <div className="pointer-events-none absolute bottom-14 right-6 text-accent md:bottom-16 md:right-10">
        <HudFrame corner="br" size={26} />
      </div>

      {/* Top-left label */}
      <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
        <div className="h-px w-8 bg-accent/60" />
        <span className="font-sans text-[12px] tracking-[0.12em] text-zinc-300">
          The final memory
        </span>
      </div>

      {/* Top-right label */}
      <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
        <span className="font-sans text-[12px] tracking-[0.12em] text-zinc-300 hidden md:inline">
          End of archive
        </span>
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(159,220,200,0.85)]" />
      </div>

      {/* Centered farewell content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <EyebrowBadge>The end of the journey</EyebrowBadge>
        <h2 className="max-w-[14ch] font-sans text-5xl font-semibold leading-[0.95] tracking-tighter text-foreground md:text-7xl lg:text-8xl">
          The memory
          <br />
          <span className="text-accent">remains.</span>
        </h2>
        <p className="max-w-[42ch] font-sans text-sm leading-relaxed text-zinc-400 md:text-base">
          A quiet farewell to Himmel, carried forward by those who knew him.
        </p>
      </div>

      {/* Bottom label bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10" />
        <div className="mx-6 flex items-center justify-between pb-4 font-sans text-[11px] tracking-[0.12em] text-zinc-400 md:mx-10">
          <span>Farewell</span>
          <span>Himmel&apos;s legacy</span>
          <span>End</span>
        </div>
      </div>
    </section>
  );
}
