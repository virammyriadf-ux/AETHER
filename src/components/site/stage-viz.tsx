"use client";

import { motion, useReducedMotion } from "framer-motion";

import { randomWalk, toPath } from "@/lib/series";

/*
 * Five small diagrams, one per pipeline stage. Deliberately abstract: they
 * show the shape of each step, not real numbers.
 */

const VB = "0 0 160 64";

function useAnim() {
  const reduce = useReducedMotion();
  return {
    reduce,
    draw: (delay = 0) => ({
      initial: reduce ? false : { pathLength: 0, opacity: 0 },
      whileInView: { pathLength: 1, opacity: 1 },
      viewport: { once: true },
      transition: { duration: 1, delay, ease: "easeInOut" as const },
    }),
  };
}

/** 1. Data — discrete ticks arriving. */
export function VizData() {
  const { reduce } = useAnim();
  const bars = [22, 34, 18, 44, 28, 52, 30, 40, 24, 48, 36, 20];
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={6 + i * 13}
          width="4"
          rx="2"
          y={60 - h}
          height={h}
          fill="var(--data)"
          opacity="0.75"
          initial={reduce ? false : { scaleY: 0, originY: 1 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${8 + i * 13}px 60px` }}
        />
      ))}
    </svg>
  );
}

/** 2. Research — a cloud of observations with a fitted relationship. */
export function VizResearch() {
  const { reduce, draw } = useAnim();
  const pts = randomWalk({ seed: 3, points: 26, drift: 0, volatility: 6, start: 32 });
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
      {pts.map((v, i) => (
        <motion.circle
          key={i}
          cx={8 + i * 5.8}
          cy={Math.max(8, Math.min(56, v))}
          r="2"
          fill="var(--muted-foreground)"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 0.65 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.02 }}
        />
      ))}
      <motion.line
        x1="6"
        y1="46"
        x2="154"
        y2="20"
        stroke="var(--signal)"
        strokeWidth="2"
        strokeLinecap="round"
        {...draw(0.3)}
      />
    </svg>
  );
}

/** 3. Backtest — a simulated equity curve. */
export function VizBacktest() {
  const { draw } = useAnim();
  const { d } = toPath(
    randomWalk({ seed: 21, points: 60, drift: 0.5, volatility: 1.6 }),
    160,
    64,
    8
  );
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
      <line x1="0" y1="56" x2="160" y2="56" stroke="var(--grid)" strokeWidth="1" />
      <motion.path
        d={d}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(0.1)}
      />
    </svg>
  );
}

/** 4. Risk — exposure held inside hard limits. */
export function VizRisk() {
  const { reduce, draw } = useAnim();
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
      <line x1="4" y1="14" x2="156" y2="14" stroke="var(--destructive)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
      <line x1="4" y1="50" x2="156" y2="50" stroke="var(--destructive)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
      <motion.path
        d="M6,32 C30,20 46,44 70,30 C94,17 110,45 134,28 L154,34"
        fill="none"
        stroke="var(--warn)"
        strokeWidth="2"
        strokeLinecap="round"
        {...draw(0.15)}
      />
      <motion.circle
        cx="154"
        cy="34"
        r="3.5"
        fill="var(--warn)"
        initial={reduce ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.3 }}
      />
    </svg>
  );
}

/** 5. Execution — orders released into the book. */
export function VizExecution() {
  const { reduce } = useAnim();
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
      <line x1="80" y1="6" x2="80" y2="58" stroke="var(--grid)" strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={`b${i}`}
          x={10 + i * 16}
          y={20 + i * 4}
          width="12"
          height="6"
          rx="2"
          fill="var(--signal)"
          opacity="0.8"
          initial={reduce ? false : { x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={`a${i}`}
          x={92 + i * 16}
          y={38 - i * 4}
          width="12"
          height="6"
          rx="2"
          fill="var(--data)"
          opacity="0.8"
          initial={reduce ? false : { x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  );
}
