import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TopBar from '@/components/TopBar';
import ChatView from '@/components/ChatView';
import type { ProviderKey } from '@/lib/providers/types';
import type { ResponseStatus } from '@/components/ResponseCard';

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: thread } = await supabase
    .from('threads')
    .select('id, title, updated_at')
    .eq('id', threadId)
    .single();

  if (!thread) notFound();

  const { data: turns } = await supabase
    .from('turns')
    .select('id, prompt, created_at, responses(id, provider_key, model, content, status, error)')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  const initialTurns = (turns ?? []).map((t: any) => ({
    id: t.id as string,
    prompt: t.prompt as string,
    responses: (t.responses ?? []).map((r: any) => ({
      id: r.id as string,
      provider_key: r.provider_key as ProviderKey,
      model: r.model as string,
      content: r.content as string,
      status: r.status as ResponseStatus,
      error: r.error as string | null,
    })),
  }));

  return (
    <>
      <TopBar
        threadTitle="Aether"
        threadSubtitle={thread.title}
        userEmail={user.email ?? ''}
      />
      <ChatView
        threadId={thread.id}
        initialTurns={initialTurns}
        userEmail={user.email ?? ''}
      />
    </>
  );
}
