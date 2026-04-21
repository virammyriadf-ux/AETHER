'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listAllProviders } from '@/lib/providers';
import type { ProviderKey } from '@/lib/providers/types';
import Composer from './Composer';
import { ResponseCard, type ResponseStatus } from './ResponseCard';

type ResponseRow = {
  id: string;
  provider_key: ProviderKey;
  model: string;
  content: string;
  status: ResponseStatus;
  error: string | null;
};

type TurnView = {
  id: string;
  prompt: string;
  responses: ResponseRow[];
};

export default function ChatView({
  threadId,
  initialTurns,
  userEmail,
}: {
  threadId: string | null;
  initialTurns: TurnView[];
  userEmail: string;
}) {
  const router = useRouter();
  const [turns, setTurns] = useState<TurnView[]>(initialTurns);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const providers = listAllProviders();

  const initial = (userEmail[0] ?? 'Y').toUpperCase();

  useEffect(() => {
    // Auto-scroll to bottom when turns update.
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  async function handleSubmit(prompt: string) {
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, prompt }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Failed to start chat');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let newThreadId: string | null = threadId;
      let currentTurn: TurnView | null = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: any;
          try { event = JSON.parse(line); } catch { continue; }

          if (event.type === 'init') {
            newThreadId = event.threadId;
            currentTurn = {
              id: event.turnId,
              prompt,
              responses: event.responses.map((r: any) => ({
                id: r.id,
                provider_key: r.provider_key,
                model: r.model,
                content: '',
                status: r.status as ResponseStatus,
                error: null,
              })),
            };
            setTurns((prev) => [...prev, currentTurn!]);
          } else if (event.type === 'delta' && currentTurn) {
            setTurns((prev) =>
              prev.map((t) => {
                if (t.id !== currentTurn!.id) return t;
                return {
                  ...t,
                  responses: t.responses.map((r) =>
                    r.id === event.responseId
                      ? { ...r, content: r.content + event.text }
                      : r,
                  ),
                };
              }),
            );
          } else if (event.type === 'done' && currentTurn) {
            setTurns((prev) =>
              prev.map((t) => {
                if (t.id !== currentTurn!.id) return t;
                return {
                  ...t,
                  responses: t.responses.map((r) =>
                    r.id === event.responseId
                      ? { ...r, status: 'complete' as ResponseStatus }
                      : r,
                  ),
                };
              }),
            );
          } else if (event.type === 'error' && currentTurn) {
            setTurns((prev) =>
              prev.map((t) => {
                if (t.id !== currentTurn!.id) return t;
                return {
                  ...t,
                  responses: t.responses.map((r) =>
                    r.id === event.responseId
                      ? { ...r, status: 'error' as ResponseStatus, error: event.message }
                      : r,
                  ),
                };
              }),
            );
          }
        }
      }

      // If this was a new thread, update the URL so the sidebar stays in sync.
      if (!threadId && newThreadId) {
        router.replace(`/chat/${newThreadId}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="conversation" ref={scrollRef}>
        {turns.length === 0 && (
          <div className="empty">
            <div className="empty-inner">
              <h2 className="empty-title">One prompt. Every AI.</h2>
              <p className="empty-sub">
                Type a question below. Aether will send it to every AI you&apos;ve connected
                and stream their answers side-by-side.
              </p>
            </div>
          </div>
        )}

        {turns.map((turn) => (
          <section key={turn.id}>
            <div className="message-user">
              <div className="avatar-sm">{initial}</div>
              <div className="content">
                <div className="eyebrow">You</div>
                <div>{turn.prompt}</div>
              </div>
            </div>

            <div className="responses-divider"><span>Responses</span></div>

            <div className="responses">
              {providers.map((p) => {
                const r = turn.responses.find((x) => x.provider_key === p.key);
                if (!r) {
                  return (
                    <ResponseCard
                      key={p.key}
                      provider={p}
                      content=""
                      status="unavailable"
                    />
                  );
                }
                return (
                  <ResponseCard
                    key={p.key}
                    provider={p}
                    content={r.content}
                    status={r.status}
                    error={r.error}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <Composer onSubmit={handleSubmit} disabled={sending} />
    </>
  );
}
