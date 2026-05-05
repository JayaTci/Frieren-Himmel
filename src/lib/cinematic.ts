export type Beat = {
  id: string;
  show: number;
  hide: number;
  label: string;
  quote: string;
  speaker: string;
  film: string;
};

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.1,
    hide: 0.3,
    label: "01 - Departure",
    quote: "You should get to know people while you still can.",
    speaker: "Himmel",
    film: "HERO'S PARTY - YEAR 00",
  },
  {
    id: "b2",
    show: 0.35,
    hide: 0.55,
    label: "02 - Blue Moon",
    quote: "Some spells are only beautiful because someone remembered why.",
    speaker: "Frieren",
    film: "NORTHERN LANDS - YEAR 28",
  },
  {
    id: "b3",
    show: 0.6,
    hide: 0.8,
    label: "03 - Afterimage",
    quote: "The hero's light remains longest in the quiet places.",
    speaker: "Frieren",
    film: "AUREOLE ROUTE - PRESENT",
  },
];

export const CINE_INTRO_FADE_END = 0.08;
