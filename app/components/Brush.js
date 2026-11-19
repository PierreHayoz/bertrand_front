/*
 * Coups de pinceau décoratifs (SVG). Chaque trait est composé de plusieurs passages
 * de largeur et d'opacité différentes ; le filtre #brush (BrushDefs) donne des bords
 * irréguliers et une texture de brosse sèche. Animation : Motion.js (data-brush) —
 * le trait se peint à l'entrée dans l'écran puis dérive légèrement au défilement.
 */

const STROKES = {
  // grand geste horizontal, légèrement ondulé
  swoosh: {
    viewBox: "0 0 1000 260",
    d: "M30 190 C 170 120, 300 215, 460 150 S 760 60, 975 105",
    width: 74,
  },
  // boucle ouverte, comme un cercle tracé vite autour d'un mot
  loop: {
    viewBox: "0 0 1000 420",
    d: "M150 250 C 120 110, 420 40, 650 60 C 900 85, 960 230, 800 320 C 620 410, 260 400, 140 300 C 95 262, 120 200, 190 170",
    width: 34,
  },
  // touche courte et épaisse
  dab: {
    viewBox: "0 0 600 200",
    d: "M40 120 C 140 70, 260 140, 380 95 S 520 70, 560 85",
    width: 92,
  },
  // trait montant, en diagonale
  rise: {
    viewBox: "0 0 800 500",
    d: "M40 440 C 200 380, 260 260, 420 230 S 640 120, 760 40",
    width: 64,
  },
};

/** Filtre partagé (à inclure une seule fois dans la page). */
export function BrushDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <filter id="brush" x="-5%" y="-25%" width="110%" height="150%" colorInterpolationFilters="sRGB">
          {/* bords irréguliers */}
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.06" numOctaves="2" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="22" xChannelSelector="R" yChannelSelector="G" result="rough" />
          {/* stries de brosse sèche, dans le sens du geste */}
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.16" numOctaves="3" seed="11" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.85" result="bristles" />
          <feComposite in="rough" in2="bristles" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * @param variant  "swoosh" | "loop" | "dab" | "rise"
 * @param className  position et taille (absolute…), le parent doit être `relative isolate`
 * @param tone  "accent" (jaune) ou "ink" (encre très légère)
 */
export default function Brush({ variant = "swoosh", className = "", tone = "accent", flip = false }) {
  const s = STROKES[variant] ?? STROKES.swoosh;
  const passes = [
    { w: s.width, o: 0.95, dy: 0 },
    { w: s.width * 0.62, o: 0.75, dy: -s.width * 0.22 },
    { w: s.width * 0.3, o: 0.6, dy: s.width * 0.26 },
  ];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-brush
      viewBox={s.viewBox}
      preserveAspectRatio="none"
      className={`brush brush-${tone} pointer-events-none absolute -z-10 overflow-visible ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      <g filter="url(#brush)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {passes.map((p, i) => (
          <path
            key={i}
            d={s.d}
            transform={`translate(0 ${p.dy})`}
            strokeWidth={p.w}
            strokeOpacity={p.o}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="0"
          />
        ))}
      </g>
    </svg>
  );
}
