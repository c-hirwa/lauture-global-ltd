import { CSSProperties } from "react";

type Props = {
  /** Tailwind/CSS color value for the section ABOVE (e.g. "hsl(var(--background))") */
  from: string;
  /** Color of the section BELOW */
  to: string;
  /** Diagonal direction. tr = seam tilts up to the right, tl = up to the left, flat = horizontal */
  direction?: "tr" | "tl" | "flat";
  /** Position: 'bottom' (sits at bottom of upper section) or 'top' (sits at top of lower section) */
  position?: "bottom" | "top";
  /** Height of the blend zone in px. Default 180 */
  height?: number;
  className?: string;
};

/**
 * Ultra-soft diagonal gradient blend between two sections.
 * No hard lines — uses a wide multi-stop linear gradient so the seam reads as a subtle, diffused fade.
 * Parent must be position:relative and overflow:hidden.
 */
const SectionBlend = ({
  from,
  to,
  direction = "tr",
  position = "bottom",
  height = 180,
  className = "",
}: Props) => {
  // Angles tuned for a gentle ~6° diagonal across full width.
  const angle = direction === "tr" ? 186 : direction === "tl" ? 174 : 180;

  // Transparent version of `from` — supports hsl(var(--x)) by appending ' / 0'
  const toTransparent = (c: string) => {
    if (c.includes("hsl(") && c.includes(")")) {
      // hsl(var(--background)) -> hsl(var(--background) / 0)
      return c.replace(/\)\s*$/, " / 0)");
    }
    return "transparent";
  };

  const style: CSSProperties = {
    height: `${height}px`,
    background: `linear-gradient(${angle}deg, ${toTransparent(from)} 0%, ${from} 18%, ${from} 38%, ${to} 62%, ${to} 100%)`,
  };

  const posClass = position === "bottom" ? "-bottom-px" : "-top-px";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${posClass} z-10 ${className}`}
      style={style}
    />
  );
};

export default SectionBlend;
