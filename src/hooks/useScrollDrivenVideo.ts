"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Manages scroll-driven video scrubbing on a canvas element.
 * Handles video buffering progress, cover-fill canvas drawing, and seek catch-up
 * to prevent frame stacking during fast scroll.
 *
 * @param src - Public path to the MP4 file (e.g. "/source-media/processed-videos/intro.mp4")
 * @returns Refs and state the caller attaches to <video> and <canvas>, plus a seekTo() fn.
 */
export function useScrollDrivenVideo(src: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const seekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const loadedRef = useRef(false);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  /** Draws the current video frame to canvas with cover-fill scaling. */
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

    // 1.3x upscale on narrow screens for better fill coverage
    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(video, drawX, drawY, drawW, drawH);
  }, []);

  /** Resizes the canvas to match the viewport and redraws. */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    drawVideoFrame();
  }, [drawVideoFrame]);

  // Wire video loading events
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

    const onError = () => {
      // Fill canvas with site background if video fails to load
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.fillStyle = "#071816";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    video.src = src;
    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", onCanPlay);
    video.addEventListener("error", onError);

    if (video.readyState >= 4) onCanPlay();

    return () => {
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, [src]);

  // Wire seek catch-up: after each seek, redraw and chase if scroll moved ahead
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

  // Resize canvas on mount and window resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Draw first frame as soon as video is ready
  useEffect(() => {
    if (!loaded) return;
    drawVideoFrame();
  }, [loaded, drawVideoFrame]);

  /**
   * Seeks the video to the position mapped from scroll progress [0, 1].
   * Skips if already seeking — the onseeked handler catches up automatically.
   */
  const seekTo = useCallback((progress: number) => {
    const video = videoRef.current;
    if (!loadedRef.current || !video || !video.duration) return;
    const targetTime = progress * video.duration;
    targetTimeRef.current = targetTime;
    if (!seekingRef.current) {
      seekingRef.current = true;
      video.currentTime = targetTime;
    }
  }, []);

  return {
    videoRef,
    canvasRef,
    loaded,
    loadProgress,
    loadedRef,
    seekTo,
  };
}
