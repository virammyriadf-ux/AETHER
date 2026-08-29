import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-card/30 px-6 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-xl border border-border/70 bg-background/60 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Risk disclaimer
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            Derivatives trading carries a high level of risk and is not suitable
            for every investor. You can lose more than your initial outlay.
            Nothing on this page is investment advice, a recommendation, or a
            solicitation to buy or sell any security, and nothing here should be
            relied on as a basis for any investment decision. Any figures or
            charts shown are illustrative of process and are not actual trading
            results. Past performance is not indicative of future results.
          </p>
          {site.regulatory && (
            <p className="mt-3 text-sm text-muted-foreground">{site.regulatory}</p>
          )}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p className="font-mono tracking-[0.18em]">{site.name}</p>
          <p>
            © {year} {site.operator}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
