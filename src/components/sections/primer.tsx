"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";

import { Section } from "@/components/site/section";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const terms = [
  {
    q: "What is a derivative?",
    a: "A contract whose value is derived from something else — here, a share or an index. You are not buying the underlying asset; you are trading an agreement about its future price. That indirection is what lets risk be shaped so precisely.",
  },
  {
    q: "What is a future?",
    a: "An agreement to buy or sell something at a set price on a set future date. Both sides are obliged to honour it. Futures move roughly one-for-one with the underlying, so gains and losses scale directly with how far the price travels.",
  },
  {
    q: "What is an option?",
    a: "The right, but not the obligation, to buy (a call) or sell (a put) at a set price before a set date. The buyer pays a premium for that right. The most a buyer can lose is the premium; the seller collects it and takes on the obligation instead.",
  },
  {
    q: "What are strike and expiry?",
    a: "The strike is the price the contract is written around. The expiry is the date it ceases to exist. Together they define the option: the same underlying has hundreds of live contracts at any moment, one for each strike-and-expiry pair.",
  },
  {
    q: "What is a backtest — and why be suspicious of one?",
    a: "Replaying a strategy over historical data to see how it would have performed. It is essential and it is easy to fool yourself with: try enough variations and one will look excellent purely by chance. A backtest that has not accounted for costs, or that was tuned until it looked good, tells you almost nothing.",
  },
  {
    q: "What is slippage?",
    a: "The gap between the price a model assumed and the price actually received. Markets move while an order travels, and large orders move the price themselves. Slippage quietly decides whether many strategies are viable.",
  },
  {
    q: "What is drawdown?",
    a: "The fall from a peak in account value to the trough that follows, before a new peak is made. It is the honest measure of how uncomfortable a strategy is to live through — and the number that matters far more than a headline return.",
  },
  {
    q: "If it is all automated, what does the human do?",
    a: "Research, engineering and supervision. Forming hypotheses, testing them properly, building the systems that place orders reliably, and monitoring for the ways things break — a data feed stalling, a broker API failing, a market regime the model never saw. The human designs and maintains the machine; the machine makes the trading decisions.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <div className="border-b border-border/70 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left transition-colors hover:text-signal"
        >
          <span className="text-base font-medium sm:text-lg">{q}</span>
          <motion.span
            aria-hidden
            animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors",
              open
                ? "border-signal/40 bg-signal/10 text-signal"
                : "border-border/70 text-muted-foreground"
            )}
          >
            <Plus className="size-4" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            key="panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-6 pr-12 text-pretty leading-relaxed text-muted-foreground">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Primer() {
  return (
    <Section
      id="primer"
      eyebrow="05 — The vocabulary"
      title="Plain answers to the questions everyone has first"
      lede="No prior background assumed. Open whichever ones you need."
    >
      <Reveal>
        <div className="rounded-xl border border-border/70 bg-card/50 px-6 sm:px-8">
          {terms.map((t) => (
            <Item key={t.q} {...t} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
