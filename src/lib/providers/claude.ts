import Anthropic from '@anthropic-ai/sdk';
import type { ProviderAdapter } from './types';

const MODEL = 'claude-opus-4-7';

export const claude: ProviderAdapter = {
  key: 'claude',
  name: 'Claude',
  model: MODEL,
  glyph: 'C',
  enabled: Boolean(process.env.ANTHROPIC_API_KEY),

  async stream(prompt, onDelta, signal) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = client.messages.stream(
      {
        model: MODEL,
        max_tokens: 4096,
        // Cache a stable system prompt so subsequent turns in the same
        // conversation are cheaper. Safe for first turn too.
        system: [
          {
            type: 'text',
            text:
              'You are a helpful AI assistant answering questions clearly and concisely. ' +
              'Prefer plain prose. Use short paragraphs.',
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: prompt }],
      },
      { signal },
    );

    let full = '';
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        const piece = event.delta.text;
        full += piece;
        onDelta(piece);
      }
    }
    return full;
  },
};
