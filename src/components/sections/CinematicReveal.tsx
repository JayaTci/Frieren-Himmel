"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { BEATS } from "@/lib/cinematic";

export function CinematicReveal() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const h2GoneRef = useRef<HTMLHeadingElement | null>(null);
  const h2ContinuesRef = useRef<HTMLHeadingElement | null>(null);
  const outroRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const seqReadoutRef = useRef<HTMLSpanElement | null>(null);

  // Seek tracking refs — avoids stacking seeks during fast scroll
  const seekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const prevVisibleIdsRef = useRef("");

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleBeats, setVisibleBeats] = useState<Set<string>>(new Set());

  /**
   * Draws the current video frame to the canvas with cover-fill scaling.
   * Called after each successful seek via video.onseeked.
   */
  const drawVideoFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !video.videoWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = video.videoWidth / video.videoHeight;
    const canvasRatio = cw / ch;

    let drawW: number;
    let drawH: number;
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(video, drawX, drawY, drawW, drawH);
  }, []);

  /**
   * Sets up video loading handlers — tracks buffer progress and fires loaded
   * state once the browser has enough data to play through without stalling.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onProgress = () => {
      if (video.buffered.length > 0 && video.duration > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setLoadProgress(bufferedEnd / video.duration);
      }
    };

    const onCanPlay = () => {
      loadedRef.current = true;
      setLoadProgress(1);
      setLoaded(true);
    };

    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", onCanPlay);

    if (video.readyState >= 4) onCanPlay();

    return () => {
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", onCanPlay);
    };
  }, []);

  /**
   * Wires up video.onseeked so the canvas redraws after each seek.
   * If scroll moved past the sought frame while seeking, seeks again to catch up.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.onseeked = () => {
      drawVideoFrame();
      const delta = Math.abs(video.currentTime - targetTimeRef.current);
      if (delta > 0.04) {
        video.currentTime = targetTimeRef.current;
      } else {
        seekingRef.current = false;
      }
    };

    return () => {
      video.onseeked = null;
    };
  }, [drawVideoFrame]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    drawVideoFrame();
  }, [drawVideoFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    drawVideoFrame();
  }, [loaded, drawVideoFrame]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        const video = videoRef.current;
        if (!section || !loadedRef.current || !video || !video.duration) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        // Seek video to scroll-mapped time
        const targetTime = progress * video.duration;
        targetTimeRef.current = targetTime;
        if (!seekingRef.current) {
          seekingRef.current = true;
          video.currentTime = targetTime;
        }

        if (h2GoneRef.current) {
          const op = Math.min(1, Math.max(0, (0.52 - progress) / 0.1));
          h2GoneRef.current.style.opacity = String(op);
        }

        if (h2ContinuesRef.current) {
          const op = Math.min(1, Math.max(0, (progress - 0.48) / 0.1));
          h2ContinuesRef.current.style.opacity = String(op);
        }

        if (outroRef.current) {
          const op = Math.min(1, Math.max(0, (progress - 0.86) / 0.06));
          outroRef.current.style.opacity = String(op);
          outroRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
        }

        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }

        if (seqReadoutRef.current) {
          const frame = Math.floor(progress * 169) + 1;
          const n = Math.min(169, frame);
          seqReadoutRef.current.textContent = `Memory ${String(n).padStart(3, "0")} / 169`;
        }

        const newVisible = new Set<string>();
        for (const b of BEATS) {
          if (progress >= b.show && progress <= b.hide) newVisible.add(b.id);
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleBeats(newVisible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cinematic"
      className="scroll-animation relative border-t border-white/5 bg-background"
    >
      {/* Hidden video element — canvas reads frames from it via drawImage */}
      <video
        ref={videoRef}
        src="/source-media/processed-videos/middle.mp4"
        muted
        playsInline
        preload="auto"
        className="pointer-events-none absolute opacity-0"
        aria-hidden="true"
      />

      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{ height: "100dvh", willChange: "transform", transform: "translateZ(0)" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,11,0.5) 0%, rgba(10,10,11,0.2) 30%, rgba(10,10,11,0.34) 64%, rgba(10,10,11,0.88) 100%), radial-gradient(120% 80% at 50% 90%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)",
          }}
        />

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

        <div className="pointer-events-none absolute right-6 top-28 z-10 flex max-w-[46ch] flex-col items-end gap-5 text-right md:right-12 md:top-32">
          <EyebrowBadge>Aureole, the place where souls rest</EyebrowBadge>
          <div className="relative self-stretch">
            <h2
              ref={h2GoneRef}
              className="font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
              style={{ transition: "opacity 240ms ease-out" }}
            >
              The hero
              <br />
              <span className="text-accent">is gone.</span>
            </h2>
            <h2
              ref={h2ContinuesRef}
              className="absolute inset-0 font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
              style={{ opacity: 0, transition: "opacity 240ms ease-out" }}
            >
              The journey
              <br />
              <span className="text-accent">continues.</span>
            </h2>
          </div>
          <p className="max-w-[42ch] font-sans text-sm leading-relaxed text-zinc-400 md:text-base">
            Frieren carries Himmel forward in quiet recollection, one spell, town,
            and flower at a time.
          </p>
        </div>

        <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
          <div className="h-px w-8 bg-accent/60" />
          <span className="font-sans text-[12px] tracking-[0.12em] text-zinc-300">
            A quiet memory
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
          <span
            ref={seqReadoutRef}
            className="font-sans text-[11px] tracking-[0.14em] text-accent"
          >
            Memory 001 / 169
          </span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(159,220,200,0.85)]"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent"
              style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
            />
          </div>
          <div className="mx-6 flex items-center justify-between pb-4 font-sans text-[11px] tracking-[0.12em] text-zinc-400 md:mx-10">
            <span>Hero&apos;s Party</span>
            <span>Frieren remembers</span>
            <span>Scroll</span>
          </div>
        </div>

        {BEATS.map((b, i) => {
          const visible = visibleBeats.has(b.id);
          const position =
            i === 0
              ? "top-[24%] left-6 md:left-12"
              : i === 1
              ? "top-1/2 -translate-y-1/2 left-6 md:left-12"
              : "bottom-24 left-6 md:bottom-28 md:left-12";
          return (
            <div
              key={b.id}
              className={`pointer-events-none absolute ${position} z-20 hidden w-[420px] max-w-[90vw] md:block`}
            >
              <figure
                className={`card-surface pointer-events-auto p-6 transition-all duration-400 ease-out ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                }`}
              >
                <span className="font-sans text-[12px] tracking-[0.12em] text-accent">
                  {b.label}
                </span>
                <blockquote className="mt-3 font-sans text-xl font-medium leading-snug tracking-tight text-foreground">
                  &ldquo;{b.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <span className="font-sans text-sm text-zinc-300">{b.speaker}</span>
                  <span className="font-sans text-[11px] tracking-[0.1em] text-zinc-300">
                    {b.film}
                  </span>
                </figcaption>
              </figure>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 top-[36%] z-20 flex flex-col gap-3 px-6 md:hidden">
          {BEATS.map((b) => {
            const visible = visibleBeats.has(b.id);
            return (
              <figure
                key={b.id}
                className={`card-surface pointer-events-auto p-5 transition-all duration-400 ease-out ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <span className="font-sans text-[10px] tracking-[0.12em] text-accent">
                  {b.label}
                </span>
                <blockquote className="mt-2 font-sans text-base font-medium leading-snug text-foreground">
                  &ldquo;{b.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 flex items-center justify-between">
                  <span className="font-sans text-xs text-zinc-300">{b.speaker}</span>
                  <span className="font-sans text-[10px] tracking-[0.1em] text-zinc-300">
                    {b.film}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div
          ref={outroRef}
          className="pointer-events-none absolute bottom-24 right-6 z-10 flex flex-col items-end gap-4 md:bottom-32 md:right-12"
          style={{ opacity: 0, transition: "opacity 80ms linear" }}
        >
          <span className="font-sans text-[12px] tracking-[0.12em] text-accent">
            Then &mdash; onward
          </span>
          <a
            href="#systems"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-accent/25 bg-[rgba(7,24,22,0.36)] px-5 py-2.5 font-sans text-[13px] font-medium tracking-[0.12em] text-foreground backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12] active:translate-y-[1px]"
          >
            Open memories
            <span aria-hidden>&darr;</span>
          </a>
        </div>

        {!loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-background px-6">
            <EyebrowBadge>Restoring the journey</EyebrowBadge>
            <div className="h-px w-60 bg-white/10 md:w-80">
              <div
                className="h-full bg-accent transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <p className="font-sans text-[12px] tracking-[0.12em] text-zinc-400">
              Rendering Aureole Route &nbsp;&middot;&nbsp; {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
