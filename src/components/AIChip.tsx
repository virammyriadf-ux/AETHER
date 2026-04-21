import type { ProviderConfig } from '@/lib/providers/types';

export function AIChip({ provider, disabled }: { provider: ProviderConfig; disabled?: boolean }) {
  return (
    <div className={`ai-chip${disabled ? ' disabled' : ''}`}>
      <div className={`ai-chip-icon ${provider.key}`}>
        {provider.key === 'gemini'
          ? <GeminiGlyph />
          : provider.glyph}
      </div>
      <div className="ai-chip-body">
        <span className="ai-chip-name">{provider.name}</span>
        <span className="ai-chip-model">{provider.model}</span>
      </div>
    </div>
  );
}

export function GeminiGlyph() {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" />
    </svg>
  );
}
