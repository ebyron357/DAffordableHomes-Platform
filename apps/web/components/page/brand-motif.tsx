/**
 * Decorative brand ornament.
 *
 * Interior mastheads used to be a navy band with type on the left and nothing
 * at all on the right — roughly half the first viewport of every interior route
 * was empty colour. The approved photograph library has four images and three of
 * them are Debra, so the answer could not be "put a photo in every masthead":
 * repeating one portrait across eighteen routes is the tiny-thumbnail treatment
 * the brief rules out, and inventing city photography is fabrication.
 *
 * So the right side carries architectural linework instead — a North Texas
 * roofline and the curving road from the D'Affordable Homes mark. It is drawn
 * in brand teal, green and gold, it says "residential real estate" at a glance,
 * and it claims nothing. Ornament only: always `aria-hidden`, never load-bearing
 * for meaning, and never a stand-in for a photograph in a content slot.
 */
export type BrandMotifVariant = "roofline" | "route" | "keys"

export function BrandMotif({
  variant = "roofline",
  className,
}: {
  variant?: BrandMotifVariant
  className?: string
}) {
  if (variant === "route") {
    return (
      <svg className={className} viewBox="0 0 480 320" fill="none" aria-hidden="true" focusable="false">
        <g className="dh-motif-line">
          <path d="M18 302C118 302 150 232 150 176c0-52 40-92 96-92 58 0 92 40 92 94 0 56 38 124 124 124" />
          <path d="M18 302C118 302 150 232 150 176c0-52 40-92 96-92 58 0 92 40 92 94 0 56 38 124 124 124" className="dh-motif-route-shadow" />
        </g>
        <g className="dh-motif-accent">
          <circle cx="150" cy="176" r="7" />
          <circle cx="338" cy="178" r="7" />
        </g>
      </svg>
    )
  }

  if (variant === "keys") {
    /* A key laid across a house outline: "the keys to a home", drawn rather
       than stated. An earlier version was a lone ring and a stem, which read
       as a magnifying glass — the wrong subject entirely for a program page. */
    return (
      <svg className={className} viewBox="0 0 420 320" fill="none" aria-hidden="true" focusable="false">
        <g className="dh-motif-line">
          {/* House */}
          <path d="M96 268V148l104-74 104 74v120" />
          <path d="M74 160 200 70l126 90" />
          <path d="M60 268h300" />
          <rect x="136" y="176" width="42" height="38" rx="1" />
          <rect x="226" y="176" width="42" height="38" rx="1" />
        </g>
        <g className="dh-motif-accent">
          {/* Key: ring, shaft, two teeth */}
          <circle cx="112" cy="234" r="30" />
          <circle cx="112" cy="234" r="11" />
          <path d="M142 234h150" />
          <path d="M254 234v26M288 234v20" />
        </g>
        <g className="dh-motif-route">
          <path d="M150 300c26-18 94-18 120 0" />
        </g>
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 640 340" fill="none" aria-hidden="true" focusable="false">
      {/* Horizon */}
      <g className="dh-motif-line">
        <path d="M0 300h640" className="dh-motif-ground" />

        {/* Low brick ranch, left */}
        <path d="M26 300v-78l64-46 64 46v78" />
        <path d="M10 180 90 122l80 58" />
        <rect x="58" y="238" width="30" height="32" rx="1" />
        <rect x="108" y="238" width="26" height="26" rx="1" />

        {/* Two-storey, centre-left */}
        <path d="M186 300V178l60-44 60 44v122" />
        <path d="M172 188l74-54 74 54" />
        <rect x="212" y="200" width="26" height="24" rx="1" />
        <rect x="256" y="200" width="26" height="24" rx="1" />
        <rect x="230" y="252" width="30" height="48" rx="1" />

        {/* Tall gable, centre — the anchor of the skyline */}
        <path d="M338 300V150l74-56 74 56v150" />
        <path d="M322 160l90-68 90 68" />
        <rect x="372" y="176" width="30" height="28" rx="1" />
        <rect x="424" y="176" width="30" height="28" rx="1" />
        <rect x="392" y="240" width="40" height="60" rx="1" />

        {/* Townhome pair, right */}
        <path d="M516 300v-92l50-36 50 36v92" />
        <path d="M502 216l64-46 64 46" />
        <rect x="540" y="234" width="24" height="24" rx="1" />
        <rect x="578" y="234" width="24" height="24" rx="1" />
      </g>

      {/* The road from the mark, running to the doorstep */}
      <g className="dh-motif-route">
        <path d="M0 336c132 0 176-20 220-36" />
        <path d="M640 336c-140 0-190-18-232-36" />
      </g>

      {/* Chimney + a warm-lit window: the two gold notes */}
      <g className="dh-motif-accent">
        <path d="M452 128v-30h20v42" />
        <rect x="392" y="240" width="40" height="60" rx="1" className="dh-motif-lit" />
      </g>
    </svg>
  )
}
