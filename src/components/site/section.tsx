import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-20 px-6 py-24 sm:py-32", className)}
    >
      <div className="mx-auto w-full max-w-6xl">
        {(eyebrow || title || lede) && (
          <Reveal className="mb-14 max-w-3xl">
            {eyebrow && (
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-signal">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            {lede && (
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {lede}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
