export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.1,
    hide: 0.3,
    quote: "The journey we shared did not end where the road did.",
    speaker: "Frieren",
    film: "HERO'S PARTY - MEMORY 01",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "He left flowers in places even time could not quiet.",
    speaker: "Frieren",
    film: "BLUE-MOON WEED - MEMORY 02",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "Ten years became a lifetime only after he was gone.",
    speaker: "Frieren",
    film: "AFTER THE FUNERAL - MEMORY 03",
  },
];

export const HERO_TEXT_FADE_END = 0.08;
