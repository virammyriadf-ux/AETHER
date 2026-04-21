import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { enabledAdapters } from '@/lib/providers';

export const runtime = 'nodejs';
export const maxDuration = 60;

function encodeEvent(obj: unknown) {
  return new TextEncoder().encode(JSON.stringify(obj) + '\n');
}

/**
 * Naive title derived from the first prompt of a thread.
 */
function titleFromPrompt(prompt: string) {
  const t = prompt.trim().replace(/\s+/g, ' ');
  return t.length > 40 ? t.slice(0, 40).trimEnd() + '…' : t;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const prompt = (body?.prompt ?? '').toString().trim();
  let threadId: string | null = body?.threadId ?? null;

  if (!prompt) return NextResponse.json({ error: 'missing prompt' }, { status: 400 });

  // 1) Get-or-create the thread.
  if (!threadId) {
    const { data, error } = await supabase
      .from('threads')
      .insert({ user_id: user.id, title: titleFromPrompt(prompt) })
      .select('id')
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'could not create thread' }, { status: 500 });
    }
    threadId = data.id;
  } else {
    // Verify the thread belongs to the user (RLS would block but give a clean error).
    const { data } = await supabase
      .from('threads')
      .select('id, title')
      .eq('id', threadId)
      .single();
    if (!data) return NextResponse.json({ error: 'thread not found' }, { status: 404 });

    // If thread title is still the default, backfill from this prompt.
    if (data.title === 'New conversation') {
      await supabase
        .from('threads')
        .update({ title: titleFromPrompt(prompt) })
        .eq('id', threadId);
    }
  }

  // 2) Create the turn.
  const { data: turn, error: turnErr } = await supabase
    .from('turns')
    .insert({ thread_id: threadId, prompt })
    .select('id')
    .single();
  if (turnErr || !turn) {
    return NextResponse.json({ error: 'could not create turn' }, { status: 500 });
  }

  // 3) Create response rows for each enabled provider.
  const adapters = enabledAdapters();
  if (adapters.length === 0) {
    return NextResponse.json({
      error: 'No AI providers are enabled. Set ANTHROPIC_API_KEY in .env.local.',
    }, { status: 400 });
  }

  const rows = adapters.map((a) => ({
    turn_id: turn.id,
    provider_key: a.key,
    model: a.model,
    content: '',
    status: 'streaming',
  }));
  const { data: inserted, error: insErr } = await supabase
    .from('responses')
    .insert(rows)
    .select('id, provider_key, model, status');
  if (insErr || !inserted) {
    return NextResponse.json({ error: 'could not create responses' }, { status: 500 });
  }

  // 4) Stream the answers. One readable stream that multiplexes all providers.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Send init event so the client can render cards.
      controller.enqueue(
        encodeEvent({
          type: 'init',
          threadId,
          turnId: turn.id,
          responses: inserted,
        }),
      );

      await Promise.all(
        adapters.map(async (adapter) => {
          const row = inserted.find((r: any) => r.provider_key === adapter.key);
          if (!row) return;

          let full = '';
          try {
            full = await adapter.stream(prompt, (chunk) => {
              controller.enqueue(
                encodeEvent({ type: 'delta', responseId: row.id, text: chunk }),
              );
            });

            await supabase
              .from('responses')
              .update({ content: full, status: 'complete', updated_at: new Date().toISOString() })
              .eq('id', row.id);

            controller.enqueue(
              encodeEvent({ type: 'done', responseId: row.id }),
            );
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            await supabase
              .from('responses')
              .update({
                status: 'error',
                error: message,
                content: full,
                updated_at: new Date().toISOString(),
              })
              .eq('id', row.id);

            controller.enqueue(
              encodeEvent({ type: 'error', responseId: row.id, message }),
            );
          }
        }),
      );

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
