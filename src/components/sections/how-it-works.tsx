"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Database, FlaskConical, History, ShieldAlert, Send } from "lucide-react";

import { Section } from "@/components/site/section";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import {
  VizData,
  VizResearch,
  VizBacktest,
  VizRisk,
  VizExecution,
} from "@/components/site/stage-viz";

const stages = [
  {
    n: "01",
    icon: Database,
    title: "Collect the data",
    body: "Prices, volumes, order-book depth, volatility, expiry calendars. Cleaned and time-stamped, because a backtest built on bad data is worse than no backtest at all.",
    viz: VizData,
  },
  {
    n: "02",
    icon: FlaskConical,
    title: "Look for a pattern",
    body: "Form a hypothesis about market behaviour, then measure whether it actually holds — across years, across regimes, and often enough to matter after costs.",
    viz: VizResearch,
  },
  {
    n: "03",
    icon: History,
    title: "Test it against history",
    body: "Replay the rules over past data as if trading them live, including brokerage, taxes and slippage. Most ideas die here. That is the point of the step.",
    viz: VizBacktest,
  },
  {
    n: "04",
    icon: ShieldAlert,
    title: "Wrap it in risk limits",
    body: "Position sizing, maximum exposure, per-day loss caps, kill-switches. A strategy that cannot be stopped is not a strategy, it is a liability.",
    viz: VizRisk,
  },
  {
    n: "05",
    icon: Send,
    title: "Let the machine trade it",
    body: "Orders are placed, modified and cancelled programmatically, then monitored for slippage and failure. No manual entries, no overrides.",
    viz: VizExecution,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="how-it-works"
      eyebrow="02 — The process"
      title="From raw market data to a live order"
      lede="Every strategy walks the same five steps. Nothing reaches the market until it has survived all of them."
      className="border-y border-border/60 bg-card/20"
    >
      <div className="relative">
        {/* the spine the stages hang off */}
        <motion.div
          aria-hidden
          className="absolute left-[27px] top-2 w-px origin-top bg-gradient-to-b from-signal/70 via-signal/30 to-transparent md:hidden"
          style={{ bottom: "2rem" }}
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />

        <Stagger className="space-y-4 md:space-y-5" step={0.1}>
          {stages.map((s) => (
            <StaggerItem key={s.n}>
              <article className="group relative grid items-center gap-6 rounded-xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-signal/40 sm:p-6 md:grid-cols-[auto_1fr_auto] md:gap-8">
                <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-signal/25 bg-signal/[0.07] text-signal">
                    <s.icon className="size-6" />
                  </span>
                  <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                    {s.n}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {s.body}
                  </p>
                </div>

                <div className="h-16 w-full rounded-lg border border-border/60 bg-background/50 p-2 md:w-44">
                  <s.viz />
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Reveal delay={0.1}>
        <p className="mt-10 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
          Steps 3 and 4 are where most of the work actually goes. Finding an
          idea is comparatively easy; proving it survives real costs, and making
          sure a bad day cannot become a catastrophic one, is the hard part.
        </p>
      </Reveal>
    </Section>
  );
}
