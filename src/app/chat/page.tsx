import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TopBar from '@/components/TopBar';
import ChatView from '@/components/ChatView';

export default async function NewChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <>
      <TopBar
        threadTitle="Aether"
        threadSubtitle="New conversation"
        userEmail={user.email ?? ''}
      />
      <ChatView threadId={null} initialTurns={[]} userEmail={user.email ?? ''} />
    </>
  );
}
