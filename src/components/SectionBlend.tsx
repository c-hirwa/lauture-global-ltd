import { CSSProperties } from "react";

type Props = {
  /** HSL color string (without 'hsl()') of the section ABOVE, e.g. "var(--background)" or "226 65% 10%" */
  from: string;
  /** HSL color string of the section BELOW */
  to: string;
  /** Diagonal direction. Default 'tr' = high on right, low on left (cuts up to the right) */
  direction?: "tr" | "tl" | "flat";
  /** Height of the blend zone in px. Default 160 */
  height?: number;
  /** Extra blur in px applied to the gradient seam. Default 24 */
  blur?: number;
  className?: string;
};

/**
 * Soft, blurred diagonal gradient blend between two sections.
 * Place at the very bottom of the upper section (with the parent set to position: relative, overflow: hidden).
 * No hard clip-path lines — the seam is a diffused gradient that fades the upper color into the lower color.
 */
const SectionBlend = ({
  from,
  to,
  direction = "tr",
  height = 160,
  blur = 24,
  className = "",
}: Props) => {
  // Diagonal angle: tr = 200deg (top-left high → bottom-right low blends downward-right)
  // We want the blend to look like a soft diagonal line.
  const angle = direction === "tr" ? 200 : direction === "tl" ? 160 : 180;

  const fromHsl = from.startsWith("var") || from.includes("hsl") ? from : `hsl(${from})`;
  const toHsl = to.startsWith("var") || to.includes("hsl") ? to : `hsl(${to})`;
  const fromTrans = from.startsWith("var") || from.includes("hsl") ? `${from.replace(")", " / 0)")}` : `hsl(${from} / 0)`;

  const style: CSSProperties = {
    height: `${height}px`,
    background: `linear-gradient(${angle}deg, ${fromHsl} 0%, ${fromHsl} 30%, ${toHsl} 70%, ${toHsl} 100%)`,
    filter: `blur(${blur}px)`,
    transform: "translateZ(0)",
  };

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-0 right-0 -bottom-px z-10 ${className}`}
      style={{
        // Outer wrapper expands a bit so the blur doesn't get clipped at edges.
        marginLeft: "-5%",
        marginRight: "-5%",
        width: "110%",
      }}
    >
      <div style={style} />
    </div>
  );
};

export default SectionBlend;
