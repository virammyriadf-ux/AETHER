"use client";

import { motion, useReducedMotion } from "framer-motion";

import { randomWalk, toPath } from "@/lib/series";

const W = 720;
const H = 260;

const values = randomWalk({ seed: 11, points: 110, drift: 0.09, volatility: 1.5 });
const { d, pts } = toPath(values, W, H);

// A few illustrative entry/exit marks placed at fixed indices.
const marks = [
  { i: 18, kind: "long" as const },
  { i: 41, kind: "exit" as const },
  { i: 63, kind: "long" as const },
  { i: 88, kind: "exit" as const },
];

export function SignalChart() {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label="Illustrative price series with systematic entry and exit markers"
    >
      <defs>
        <linearGradient id="sig-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* horizontal guides */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="0"
          x2={W}
          y1={H * f}
          y2={H * f}
          stroke="var(--grid)"
          strokeWidth="1"
        />
      ))}

      {/* area under the curve */}
      <motion.path
        d={`${d} L${W},${H} L0,${H} Z`}
        fill="url(#sig-fill)"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduce ? 0 : 1.1 }}
      />

      {/* the price line, drawing itself */}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />

      {/* entry / exit markers */}
      {marks.map((m, idx) => {
        const p = pts[m.i];
        const color = m.kind === "long" ? "var(--data)" : "var(--warn)";
        return (
          <motion.g
            key={m.i}
            initial={reduce ? false : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.35,
              delay: reduce ? 0 : 1.3 + idx * 0.14,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          >
            <line
              x1={p.x}
              x2={p.x}
              y1={p.y}
              y2={H}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.45"
            />
            <circle cx={p.x} cy={p.y} r="5.5" fill="var(--background)" />
            <circle cx={p.x} cy={p.y} r="4" fill={color} />
          </motion.g>
        );
      })}
    </svg>
  );
}
