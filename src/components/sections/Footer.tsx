import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site";

const NAV_ITEMS: { name: string; note: string; href: string }[] = [
  { name: "Hero's Party",   note: "Demon King route", href: "#hero" },
  { name: "Blue-Moon Weed", note: "Northern village",  href: "#hero" },
  { name: "Era Meteor",     note: "Fifty-year sky",    href: "#cinematic" },
  { name: "Aureole",        note: "Land of souls",     href: "#cinematic" },
  { name: "Frieren",        note: "Memory bearer",     href: "#systems" },
  { name: "Himmel",         note: "The hero",          href: "#farewell" },
];

export function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-white/5 bg-background px-6 py-14 md:px-10 md:py-16"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 font-sans text-[13px] font-semibold tracking-[0.16em] text-foreground">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(159,220,200,0.9)]"
              />
              Himmel & Frieren
            </div>
            <p className="max-w-[38ch] font-sans text-sm leading-relaxed text-zinc-400">
              &copy; Himmel x Frieren fan tribute. Built as a premium memory
              archive for a quiet journey after the hero&apos;s funeral.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 md:grid-cols-3" aria-label="Site sections">
            {NAV_ITEMS.map(({ name, note, href }) => (
              <a key={name} href={href} className="group flex flex-col gap-1">
                <span className="font-sans text-[13px] font-medium text-foreground transition-colors group-hover:text-accent">
                  {name}
                  <ArrowUpRight
                    size={11}
                    weight="bold"
                    className="ml-1 inline-block align-baseline opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </span>
                <span className="font-sans text-[11px] tracking-[0.12em] text-zinc-400">
                  {note}
                </span>
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/5 pt-6 font-sans text-[11px] tracking-[0.12em] text-zinc-400 md:flex-row md:items-center md:justify-between">
          <span>Built {SITE.buildDate} &nbsp;&middot;&nbsp; Hero&apos;s Party &nbsp;&middot;&nbsp; A remembered journey</span>
          <span>Proof of concept &mdash; fan tribute, no commercial use</span>
        </div>
      </div>
    </footer>
  );
}
