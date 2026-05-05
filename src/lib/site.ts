/** Centralised site-wide constants — single source of truth for metadata, telemetry, and build info. */
export const SITE = {
  title: "Himmel x Frieren — Memory Archive",
  url: "https://frieren-himmel.vercel.app",
  description:
    "A scroll-driven Himmel x Frieren memory archive built with Next.js — cinematic video scrubbing, HUD overlays, and a farewell section.",

  telemetry: [
    { label: "Years Since",   value: "28 y",  note: "After Himmel's funeral" },
    { label: "Party Record",  value: "10 y",  note: "Demon King journey" },
    { label: "Memory Index",  value: "169",   note: "Recovered visual frames" },
    { label: "Aureole Route", value: "North", note: "The place souls rest" },
  ],

  buildDate: "2026.05.06",
} as const;
