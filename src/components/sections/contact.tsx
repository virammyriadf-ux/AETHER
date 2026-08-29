"use client";

import { Mail, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GridBackdrop } from "@/components/site/grid-backdrop";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

const socials = [
  { key: "x", label: "X", href: site.links.x },
  { key: "linkedin", label: "LinkedIn", href: site.links.linkedin },
  { key: "github", label: "GitHub", href: site.links.github },
].filter((s) => s.href);

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <GridBackdrop scanline={false} />

      <div className="relative mx-auto w-full max-w-3xl text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            06 — Say hello
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Curious, or building something similar?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            I am always happy to talk about systematic trading, market
            microstructure, or the engineering behind it. Questions from people
            new to the field are genuinely welcome.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href={`mailto:${site.email}`}>
                <Mail /> {site.email}
              </a>
            </Button>
            {socials.map((s) => (
              <Button key={s.key} asChild size="lg" variant="outline">
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} <ArrowUpRight />
                </a>
              </Button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
