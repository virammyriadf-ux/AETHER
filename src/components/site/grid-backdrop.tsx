"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative only: a faint coordinate grid, two slow colour blooms, and a
 * scanline. Masked to fade out toward the edges so it never competes with
 * text. aria-hidden and motion-free under prefers-reduced-motion.
 */
export function GridBackdrop({ scanline = true }: { scanline?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern
            id="aether-grid"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M56 0H0V56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="aether-grid-mask">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="55%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="aether-grid-fade">
            <rect width="100%" height="100%" fill="url(#aether-grid-mask)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#aether-grid)"
          className="text-grid"
          opacity="0.45"
          mask="url(#aether-grid-fade)"
        />
      </svg>

      {/* colour blooms */}
      <motion.div
        className="absolute -left-40 top-[-10%] h-[36rem] w-[36rem] rounded-full blur-[120px]"
        style={{ background: "color-mix(in oklab, var(--signal) 18%, transparent)" }}
        animate={reduce ? undefined : { opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 top-[20%] h-[32rem] w-[32rem] rounded-full blur-[120px]"
        style={{ background: "color-mix(in oklab, var(--data) 14%, transparent)" }}
        animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {scanline && !reduce && (
        <motion.div
          className="absolute inset-x-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--data) 55%, transparent), transparent)",
          }}
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
