import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: threads } = await supabase
    .from('threads')
    .select('id, title, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50);

  return (
    <div className="app">
      <Sidebar threads={threads ?? []} userEmail={user.email ?? ''} />
      <main className="main" style={{ position: 'relative' }}>
        {children}
      </main>
    </div>
  );
}
