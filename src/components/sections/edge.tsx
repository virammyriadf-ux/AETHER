"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Zap, Network, Anchor, Receipt } from "lucide-react";

import { Section } from "@/components/site/section";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";

const edges = [
  {
    icon: Network,
    title: "Breadth",
    claim: "Watching more than a person can",
    body: "A human can follow a handful of instruments attentively. A program can evaluate every strike, every expiry and every underlying on every tick, and act only where its conditions are met.",
  },
  {
    icon: Anchor,
    title: "Discipline",
    claim: "The rules do not get tired",
    body: "The same setup is taken on a quiet Tuesday and in the middle of a violent selloff, at the same size. No revenge trading after a loss, no hesitation after a drawdown, no widening a stop to avoid being wrong.",
  },
  {
    icon: Zap,
    title: "Reaction time",
    claim: "Acting in milliseconds",
    body: "Some opportunities exist for a very short window. Whether an edge survives depends on getting the order in before the price that justified it has already moved.",
  },
  {
    icon: Receipt,
    title: "Cost control",
    claim: "Keeping more of what the model finds",
    body: "Brokerage, taxes, spread and slippage decide whether a theoretically profitable strategy is actually profitable. Measuring and reducing them is often worth more than a cleverer signal.",
  },
];

export function Edge() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="edge"
      eyebrow="04 — The edge"
      title="Where does the advantage actually come from?"
      lede="Not from predicting the market. From doing a small number of unglamorous things more consistently than the person on the other side of the trade."
      className="border-y border-border/60 bg-card/20"
    >
      <Stagger className="grid gap-5 lg:grid-cols-2">
        {edges.map((e) => (
          <StaggerItem key={e.title}>
            <article className="group relative h-full overflow-hidden rounded-xl border border-border/70 bg-card/60 p-6 transition-colors hover:border-signal/40 sm:p-8">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-3xl"
                style={{
                  background:
                    "color-mix(in oklab, var(--signal) 14%, transparent)",
                }}
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              />
              <div className="relative">
                <span className="flex size-11 items-center justify-center rounded-lg border border-signal/25 bg-signal/[0.07] text-signal">
                  <e.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {e.title}
                </h3>
                <p className="mt-1.5 font-mono text-sm text-signal">{e.claim}</p>
                <p className="mt-3.5 text-pretty leading-relaxed text-muted-foreground">
                  {e.body}
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1}>
        <div className="mt-8 rounded-xl border border-warn/30 bg-warn/[0.05] p-6 sm:p-7">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-warn">
            The honest caveat
          </p>
          <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-foreground/85">
            An edge is a statistical tendency, not a guarantee. It shows up over
            hundreds of trades and is invisible in any single one. Edges also
            decay: as more participants find the same pattern, it stops paying.
            Which is why the research in step 02 never really finishes.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
