// Signature design element (spec §1): an isometric line-art building silhouette — a
// tower beside a low-rise villa outline — with faint architectural dimension marks and
// a small crosshair reticle, in steel/ink strokes at low opacity. It bleeds into the
// hero background as the one memorable visual; everything else stays disciplined around
// it. Purely decorative, so aria-hidden and no title (§13 — it carries no information a
// screen reader needs; the hero heading does).
//
// Server component: static markup, no interactivity, no hooks.
export function BlueprintSVG({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 480 420"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ground / horizon line */}
      <line
        x1="20"
        y1="360"
        x2="460"
        y2="300"
        stroke="#5B7A94"
        strokeWidth="1"
        opacity="0.35"
      />

      {/* Isometric tower — front and side faces + floor plate lines */}
      <g stroke="#8CA7BC" strokeWidth="1.25" fill="none" opacity="0.7">
        {/* front face */}
        <path d="M150 90 L250 120 L250 340 L150 320 Z" />
        {/* side face */}
        <path d="M250 120 L310 95 L310 315 L250 340 Z" />
        {/* roof cap */}
        <path d="M150 90 L210 65 L310 95 L250 120 Z" />
        {/* floor plates on the front face */}
        <line x1="150" y1="130" x2="250" y2="158" />
        <line x1="150" y1="170" x2="250" y2="196" />
        <line x1="150" y1="210" x2="250" y2="234" />
        <line x1="150" y1="250" x2="250" y2="272" />
        <line x1="150" y1="290" x2="250" y2="310" />
        {/* vertical mullion */}
        <line x1="200" y1="103" x2="200" y2="330" />
      </g>

      {/* Low-rise villa outline in the foreground */}
      <g stroke="#3E5A70" strokeWidth="1.25" fill="none" opacity="0.6">
        <path d="M60 300 L150 322 L150 372 L60 352 Z" />
        <path d="M150 322 L200 305 L200 355 L150 372 Z" />
        <path d="M60 300 L110 283 L200 305 L150 322 Z" />
        {/* door */}
        <path d="M95 330 L120 336 L120 360 L95 354 Z" />
      </g>

      {/* Faint architectural dimension marks along the tower height (brass) */}
      <g stroke="#A9793C" strokeWidth="0.75" opacity="0.5">
        <line x1="335" y1="95" x2="335" y2="315" />
        <line x1="330" y1="95" x2="340" y2="95" />
        <line x1="330" y1="315" x2="340" y2="315" />
        <line x1="330" y1="205" x2="340" y2="205" />
      </g>

      {/* Crosshair reticle — recurring Blueprint motif, echoing the floor plan */}
      <g stroke="#A9793C" strokeWidth="0.9" fill="none" opacity="0.65">
        <circle cx="390" cy="150" r="14" />
        <line x1="390" y1="128" x2="390" y2="172" />
        <line x1="368" y1="150" x2="412" y2="150" />
      </g>

      {/* Scattered reference dots */}
      <g fill="#8CA7BC" opacity="0.5">
        <circle cx="60" cy="300" r="2" />
        <circle cx="310" cy="95" r="2" />
        <circle cx="210" cy="65" r="2" />
      </g>
    </svg>
  )
}
