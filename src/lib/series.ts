/**
 * Deterministic synthetic price series for the illustrative charts.
 *
 * Seeded on purpose: the same numbers must come out on the server and on the
 * client or React will report a hydration mismatch, and the shapes on this
 * page are illustrations of a process — they are not real trade data.
 */

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export type Point = { x: number; y: number };

export function randomWalk({
  seed = 7,
  points = 96,
  drift = 0.12,
  volatility = 1,
  start = 50,
}: {
  seed?: number;
  points?: number;
  drift?: number;
  volatility?: number;
  start?: number;
} = {}): number[] {
  const rand = lcg(seed);
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < points; i++) {
    v += drift + (rand() - 0.5) * 2 * volatility;
    out.push(v);
  }
  return out;
}

/** Map raw values into an SVG viewBox, with a little vertical padding. */
export function toPath(
  values: number[],
  width: number,
  height: number,
  pad = 6
): { d: string; pts: Point[] } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: height - pad - ((v - min) / span) * (height - pad * 2),
  }));

  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  return { d, pts };
}
