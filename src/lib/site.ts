/**
 * Everything on this page that is specific to you lives here.
 *
 * The values marked TODO are placeholders - I have no way to know them, and
 * inventing them on a trading page would be worse than leaving them obviously
 * blank. Replace them before publishing.
 */
export const site = {
  name: "AETHER",
  tagline: "Systematic derivatives trading",

  // TODO: your name as you want it shown
  operator: "Your Name",

  // TODO: real contact address
  email: "hello@example.com",

  links: {
    // TODO: replace or delete any of these; the UI skips empty strings
    x: "",
    linkedin: "",
    github: "",
  },

  /**
   * TODO: regulatory line.
   *
   * If you are registered with SEBI in any capacity (Research Analyst,
   * Investment Adviser, or similar), put the registration details here so they
   * appear in the footer. If you are trading only your own capital and are not
   * offering advice or managing others' money, no registration is implied -
   * but then the page must not read as a solicitation, which is why the copy
   * throughout avoids performance claims and calls to invest.
   */
  regulatory: "",
} as const;

export const nav = [
  { href: "#what-is-quant", label: "The idea" },
  { href: "#how-it-works", label: "The process" },
  { href: "#what-we-do", label: "The work" },
  { href: "#edge", label: "The edge" },
  { href: "#primer", label: "Vocabulary" },
] as const;
