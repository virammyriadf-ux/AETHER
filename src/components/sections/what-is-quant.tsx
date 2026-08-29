"use client";

import { Brain, Cpu, TrendingDown, Repeat, Gauge, EyeOff } from "lucide-react";

import { Section } from "@/components/site/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const discretionary = [
  { icon: Brain, text: "A human reads the market and decides in the moment" },
  { icon: TrendingDown, text: "Conviction grows after wins, shrinks after losses" },
  { icon: EyeOff, text: "Hard to say precisely why any single trade was taken" },
];

const systematic = [
  { icon: Cpu, text: "A model decides from data, using rules fixed in advance" },
  { icon: Repeat, text: "The same input always produces the same decision" },
  { icon: Gauge, text: "Every rule is measurable, testable and auditable" },
];

function Column({
  label,
  tone,
  items,
}: {
  label: string;
  tone: "muted" | "signal";
  items: { icon: typeof Brain; text: string }[];
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6 sm:p-8",
        tone === "signal"
          ? "border-signal/35 bg-signal/[0.04]"
          : "border-border/70 bg-card/40"
      )}
    >
      <p
        className={cn(
          "font-mono text-xs uppercase tracking-[0.18em]",
          tone === "signal" ? "text-signal" : "text-muted-foreground"
        )}
      >
        {label}
      </p>
      <ul className="mt-6 space-y-5">
        {items.map((it) => (
          <li key={it.text} className="flex gap-4">
            <span
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border",
                tone === "signal"
                  ? "border-signal/30 bg-signal/10 text-signal"
                  : "border-border/70 bg-muted/40 text-muted-foreground"
              )}
            >
              <it.icon className="size-4" />
            </span>
            <span className="text-sm leading-relaxed text-foreground/85 sm:text-base">
              {it.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhatIsQuant() {
  return (
    <Section
      id="what-is-quant"
      eyebrow="01 — The idea"
      title="Quant trading is just trading with the guesswork removed"
      lede={
        <>
          A quantitative strategy is a set of rules, written down precisely
          enough that a computer can follow them without asking anyone what to
          do. The rules come from studying historical data: what tends to
          happen, how often, and how much it moves. The computer&apos;s job is
          simply to apply them, the same way, every single time.
        </>
      }
    >
      <Stagger className="grid gap-5 md:grid-cols-2">
        <StaggerItem>
          <Column label="Discretionary" tone="muted" items={discretionary} />
        </StaggerItem>
        <StaggerItem>
          <Column label="Systematic — what I do" tone="signal" items={systematic} />
        </StaggerItem>
      </Stagger>

      <Reveal delay={0.1}>
        <p className="mt-10 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
          <span className="text-foreground">The important part is the second
          column.</span>{" "}
          &ldquo;Non-discretionary&rdquo; means that once a strategy goes live,
          I do not get a vote. If the model says exit, the position is closed —
          whether or not I happen to think the market is about to turn. Removing
          that vote is the entire point: it is the part of trading where humans
          reliably do worst.
        </p>
      </Reveal>
    </Section>
  );
}
