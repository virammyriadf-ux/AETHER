import { listAllProviders } from '@/lib/providers';
import { AIChip } from './AIChip';

export default function TopBar({
  threadTitle,
  threadSubtitle,
  userEmail,
}: {
  threadTitle: string;
  threadSubtitle?: string;
  userEmail: string;
}) {
  const providers = listAllProviders();
  const initial = (userEmail[0] ?? 'U').toUpperCase();

  return (
    <header className="topbar">
      <div className="thread">
        <div className="thread-logo">A</div>
        <div>
          <div className="thread-title">{threadTitle}</div>
          {threadSubtitle && <div className="thread-sub">{threadSubtitle}</div>}
        </div>
      </div>

      <div className="active-ais">
        {providers.map((p) => (
          <AIChip key={p.key} provider={p} disabled={!p.enabled} />
        ))}
      </div>

      <div className="user-avatar" title={userEmail}>{initial}</div>
    </header>
  );
}
