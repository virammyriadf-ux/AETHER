'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Thread = {
  id: string;
  title: string;
  updated_at: string;
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  } catch {
    return '';
  }
}

export default function Sidebar({
  threads,
  userEmail,
}: {
  threads: Thread[];
  userEmail: string;
}) {
  const router = useRouter();
  const params = useParams<{ threadId?: string }>();
  const activeId = params?.threadId;
  const [incognito, setIncognito] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">A</div>
        <div className="brand-name">Aether</div>
      </div>

      <div className="incognito">
        <div className="incognito-label">
          <span className="incognito-emoji">🥸</span>
          <span>Incognito Mode</span>
        </div>
        <button
          className={`toggle${incognito ? ' on' : ''}`}
          onClick={() => setIncognito((v) => !v)}
          aria-label="Toggle incognito mode"
          aria-pressed={incognito}
        />
      </div>

      <Link href="/chat" className="new-chat">
        <span className="plus">+</span>
        <span>New Chat</span>
      </Link>

      <div className="chat-list">
        {threads.length === 0 && (
          <div className="chat-item inactive">
            <div className="title">No chats yet</div>
            <div className="meta">Start a new conversation</div>
          </div>
        )}
        {threads.map((t, i) => (
          <Link
            key={t.id}
            href={`/chat/${t.id}`}
            className={`chat-item ${t.id === activeId ? 'active' : 'inactive'}`}
          >
            <div className="title">{t.title}</div>
            <div className="meta">
              <span>{formatTime(t.updated_at)}</span>
              <span className="meta-dot">·</span>
              <span>4 AIs</span>
            </div>
            {i === 0 && threads.length > 1 && (
              <div className="chat-separator" aria-hidden="true">···</div>
            )}
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <span title={userEmail} style={{
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          flex: 1,
        }}>{userEmail}</span>
        <button onClick={signOut}>Sign out</button>
      </div>
    </aside>
  );
}
