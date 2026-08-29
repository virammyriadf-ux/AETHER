import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Hero } from "@/components/sections/hero";
import { WhatIsQuant } from "@/components/sections/what-is-quant";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhatWeDo } from "@/components/sections/what-we-do";
import { Edge } from "@/components/sections/edge";
import { Primer } from "@/components/sections/primer";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="top" className="flex-1">
        <Hero />
        <WhatIsQuant />
        <HowItWorks />
        <WhatWeDo />
        <Edge />
        <Primer />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
