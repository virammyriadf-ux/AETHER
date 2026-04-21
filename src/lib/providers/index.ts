import type { ProviderAdapter, ProviderConfig, ProviderKey } from './types';
import { claude } from './claude';

/**
 * To add a new provider (ChatGPT, Gemini, Grok):
 *   1. Create `src/lib/providers/<name>.ts` exporting a `ProviderAdapter`
 *      that mirrors the shape of `claude.ts`.
 *   2. Import it here and add it to `adapters` below.
 *   3. Add the env var key to `.env.local` and to `.env.local.example`.
 * Nothing else in the app needs to change.
 */
const adapters: ProviderAdapter[] = [
  claude,
  // openai,   // TODO: implement src/lib/providers/openai.ts
  // grok,     // TODO: implement src/lib/providers/grok.ts
  // gemini,   // TODO: implement src/lib/providers/gemini.ts
];

/** Placeholders shown in the UI even before the adapter is wired up. */
const placeholders: ProviderConfig[] = [
  { key: 'gpt',    name: 'ChatGPT', model: 'GPT-5.4 Pro',     glyph: 'G', enabled: false },
  { key: 'grok',   name: 'Grok',    model: 'Grok 4.20',       glyph: '𝕏', enabled: false },
  { key: 'gemini', name: 'Gemini',  model: 'Gemini 3.1 Pro',  glyph: '✦', enabled: false },
];

/** All providers the UI knows about (implemented + placeholder). */
export function listAllProviders(): ProviderConfig[] {
  const byKey = new Map<ProviderKey, ProviderConfig>();
  for (const p of placeholders) byKey.set(p.key, p);
  for (const a of adapters) byKey.set(a.key, a);
  // Stable order matching the prototype
  return (['claude', 'gpt', 'grok', 'gemini'] as ProviderKey[]).map(
    (k) => byKey.get(k)!,
  );
}

/** Only providers we can actually call. */
export function enabledAdapters(): ProviderAdapter[] {
  return adapters.filter((a) => a.enabled);
}

export function getAdapter(key: ProviderKey): ProviderAdapter | undefined {
  return adapters.find((a) => a.key === key);
}
