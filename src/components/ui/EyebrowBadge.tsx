type Props = { children: React.ReactNode; className?: string };

export function EyebrowBadge({ children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-accent/22 bg-[rgba(7,24,22,0.42)] px-3 py-1.5 font-sans text-[11px] font-medium tracking-[0.12em] text-accent backdrop-blur-md ${className}`}
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 28px -12px rgba(159,220,200,0.58)",
      }}
    >
      <span className="relative inline-flex h-2 w-2 items-center justify-center">
        <span className="absolute h-1.5 w-1.5 rotate-45 rounded-[2px] bg-accent/80" />
        <span className="absolute h-1 w-1 rounded-full bg-[#f3efe4]" />
      </span>
      {children}
    </span>
  );
}
