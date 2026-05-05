type Props = {
  corner: "tl" | "tr" | "bl" | "br";
  size?: number;
  className?: string;
};

export function HudFrame({ corner, size = 22, className = "" }: Props) {
  const paths: Record<Props["corner"], string> = {
    tl: `M 3 ${size - 2} C 3 ${size * 0.42}, ${size * 0.42} 3, ${size - 2} 3`,
    tr: `M 2 3 C ${size * 0.58} 3, ${size - 3} ${size * 0.42}, ${size - 3} ${size - 2}`,
    bl: `M 3 2 C 3 ${size * 0.58}, ${size * 0.42} ${size - 3}, ${size - 2} ${size - 3}`,
    br: `M 2 ${size - 3} C ${size * 0.58} ${size - 3}, ${size - 3} ${size * 0.58}, ${size - 3} 2`,
  };
  const dots: Record<Props["corner"], { cx: number; cy: number }> = {
    tl: { cx: size - 5, cy: 3 },
    tr: { cx: size - 3, cy: size - 5 },
    bl: { cx: size - 5, cy: size - 3 },
    br: { cx: 3, cy: size - 5 },
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      <path
        d={paths[corner]}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx={dots[corner].cx} cy={dots[corner].cy} r="1.8" fill="currentColor" />
    </svg>
  );
}
