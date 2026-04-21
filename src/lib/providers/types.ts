export type ProviderKey = 'claude' | 'gpt' | 'grok' | 'gemini';

export interface ProviderConfig {
  key: ProviderKey;
  name: string;
  model: string;
  /** Short letter used in the prototype's square icon (e.g. "C", "G"). */
  glyph: string;
  /** Whether this provider is fully implemented & has an API key configured. */
  enabled: boolean;
}

export interface ProviderAdapter extends ProviderConfig {
  /**
   * Streams a response for the given prompt.
   * Call `onDelta` for each new chunk of text.
   * Resolves with the full text at the end.
   */
  stream(prompt: string, onDelta: (chunk: string) => void, signal?: AbortSignal): Promise<string>;
}
