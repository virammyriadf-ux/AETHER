"use client";

import { LineChart, Layers, Timer, SlidersHorizontal } from "lucide-react";

import { Section } from "@/components/site/section";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";

const desks = [
  {
    icon: LineChart,
    title: "Index derivatives",
    body: "Options and futures on the major NSE indices. These are the most liquid instruments in the Indian market, which means rules can be executed at a price close to the one the model assumed.",
  },
  {
    icon: Layers,
    title: "Defined-risk structures",
    body: "Multi-leg positions where the worst case is known before the trade is placed, rather than discovered afterwards. Structure is chosen by the model, not by preference.",
  },
  {
    icon: Timer,
    title: "Systematic execution",
    body: "Entries, exits, rolls and adjustments are all triggered by code on a fixed schedule or a fixed condition. Order placement is automated end to end.",
  },
  {
    icon: SlidersHorizontal,
    title: "Continuous risk control",
    body: "Exposure, leverage and loss limits are enforced by the system itself. Breaching a limit stops trading automatically — it is not a judgement call.",
  },
];

export function WhatWeDo() {
  return (
    <Section
      id="what-we-do"
      eyebrow="03 — The work"
      title="What I actually trade"
      lede="Derivatives on Indian equity markets, traded systematically. Derivatives are used because they let risk be shaped precisely: how much can be lost, and under what conditions, is defined at the moment the position is opened."
    >
      <Stagger className="grid gap-5 sm:grid-cols-2">
        {desks.map((d) => (
          <StaggerItem key={d.title}>
            <article className="h-full rounded-xl border border-border/70 bg-card/60 p-6 transition-colors hover:border-signal/40 sm:p-7">
              <span className="flex size-11 items-center justify-center rounded-lg border border-data/25 bg-data/[0.07] text-data">
                <d.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {d.title}
              </h3>
              <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {d.body}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1}>
        <div className="mt-8 rounded-xl border border-border/70 bg-muted/20 p-6 sm:p-7">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            A note on what this is not
          </p>
          <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
            This is not tips, not signals for sale, and not a promise of
            returns. Systematic trading is a research and engineering
            discipline: most ideas fail testing, live results differ from
            backtests, and losing periods are an expected part of a working
            strategy rather than evidence that something has broken.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
