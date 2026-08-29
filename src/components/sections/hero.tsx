"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GridBackdrop } from "@/components/site/grid-backdrop";
import { SignalChart } from "@/components/site/signal-chart";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: reduce ? 0 : delay, ease: EASE },
  });

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32 sm:pt-40">
      <GridBackdrop />

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div
          {...rise(0)}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          Systematic · Non-discretionary · Indian equity derivatives
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="mt-8 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Rules decide.
          <br />
          <span className="text-signal text-glow">Not feelings.</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          I build and run algorithms that trade derivatives on India&apos;s equity
          markets. Every entry, every exit and every position size is decided in
          advance by a model and executed by machine — with no discretionary
          override in the loop.
        </motion.p>

        <motion.p
          {...rise(0.2)}
          className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground/80"
        >
          New to any of this? The rest of this page explains what quantitative
          trading actually is, in plain language.
        </motion.p>

        <motion.div {...rise(0.26)} className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="#what-is-quant">
              Start from the beginning <ArrowRight />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#contact">Get in touch</a>
          </Button>
        </motion.div>

        {/* terminal-framed chart */}
        <motion.figure
          {...rise(0.34)}
          className="mt-16 overflow-hidden rounded-xl border border-border/70 bg-card/70 backdrop-blur"
        >
          <figcaption className="flex items-center justify-between border-b border-border/70 px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <Activity className="size-3.5 text-signal" />
              signal_overlay.sim
            </span>
            <span className="hidden sm:inline">
              illustrative — not live market data
            </span>
          </figcaption>
          <div className="h-56 w-full px-2 py-3 sm:h-72">
            <SignalChart />
          </div>
        </motion.figure>

        <motion.dl
          {...rise(0.42)}
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-3"
        >
          {[
            { k: "Decision style", v: "100% rule-based" },
            { k: "Discretionary overrides", v: "Zero" },
            { k: "Market", v: "NSE derivatives" },
          ].map((s) => (
            <div key={s.k} className="bg-card px-5 py-5">
              <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {s.k}
              </dt>
              <dd className="mt-2 text-lg font-semibold">{s.v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
