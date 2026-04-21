import type { ProviderConfig } from '@/lib/providers/types';
import { GeminiGlyph } from './AIChip';

export type ResponseStatus = 'streaming' | 'complete' | 'error' | 'unavailable';

export function ResponseCard({
  provider,
  content,
  status,
  error,
}: {
  provider: ProviderConfig;
  content: string;
  status: ResponseStatus;
  error?: string | null;
}) {
  const isStreaming = status === 'streaming';
  const isError = status === 'error';
  const isUnavailable = status === 'unavailable';

  return (
    <article className={`response ${provider.key}`}>
      <header className="resp-header">
        <div className="resp-name">
          <div className={`resp-icon ${provider.key}`}>
            {provider.key === 'gemini' ? <GeminiGlyph /> : provider.glyph}
          </div>
          <span>{provider.name}</span>
        </div>
        <div className="resp-meta">
          <button className="kebab" aria-label="More options">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <circle cx="3.5" cy="8" r="1.3" />
              <circle cx="8" cy="8" r="1.3" />
              <circle cx="12.5" cy="8" r="1.3" />
            </svg>
          </button>
          <span className="model-pill">
            {provider.model}
            <svg className="chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.4}>
              <path d="M2.5 4 L5 6.5 L7.5 4" />
            </svg>
          </span>
        </div>
      </header>

      <div className={`resp-body${isError ? ' error' : ''}${isUnavailable ? ' muted' : ''}`}>
        {isUnavailable
          ? `${provider.name} isn't wired up yet — add an API key and adapter to enable it.`
          : isError
          ? (error ?? 'Something went wrong generating this response.')
          : (
            <>
              {content}
              {isStreaming && <span className="cursor" aria-hidden="true" />}
            </>
          )}
      </div>
    </article>
  );
}
