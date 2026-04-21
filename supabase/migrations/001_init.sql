-- ============================================================
--  Aether — initial schema
--  Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Threads: one per chat in the sidebar
create table if not exists public.threads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'New conversation',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists threads_user_updated_idx
  on public.threads (user_id, updated_at desc);

-- Turns: one per user prompt inside a thread
create table if not exists public.turns (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.threads(id) on delete cascade,
  prompt      text not null,
  created_at  timestamptz not null default now()
);
create index if not exists turns_thread_created_idx
  on public.turns (thread_id, created_at);

-- Responses: one per provider per turn
create table if not exists public.responses (
  id            uuid primary key default gen_random_uuid(),
  turn_id       uuid not null references public.turns(id) on delete cascade,
  provider_key  text not null,                    -- 'claude' | 'gpt' | 'grok' | 'gemini'
  model         text not null,                    -- e.g. 'claude-opus-4-7'
  content       text not null default '',
  status        text not null default 'streaming',-- 'streaming' | 'complete' | 'error' | 'unavailable'
  error         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists responses_turn_idx
  on public.responses (turn_id);

-- Keep threads.updated_at fresh when new turns land
create or replace function public.touch_thread_updated_at()
returns trigger language plpgsql as $$
begin
  update public.threads set updated_at = now() where id = new.thread_id;
  return new;
end;
$$;
drop trigger if exists touch_thread on public.turns;
create trigger touch_thread
  after insert on public.turns
  for each row execute function public.touch_thread_updated_at();

-- ============================================================
--  Row Level Security — users can only see their own data
-- ============================================================
alter table public.threads   enable row level security;
alter table public.turns     enable row level security;
alter table public.responses enable row level security;

-- Threads
drop policy if exists "threads owner select" on public.threads;
create policy "threads owner select" on public.threads
  for select using (auth.uid() = user_id);

drop policy if exists "threads owner insert" on public.threads;
create policy "threads owner insert" on public.threads
  for insert with check (auth.uid() = user_id);

drop policy if exists "threads owner update" on public.threads;
create policy "threads owner update" on public.threads
  for update using (auth.uid() = user_id);

drop policy if exists "threads owner delete" on public.threads;
create policy "threads owner delete" on public.threads
  for delete using (auth.uid() = user_id);

-- Turns — access via owning thread
drop policy if exists "turns via thread select" on public.turns;
create policy "turns via thread select" on public.turns
  for select using (exists (
    select 1 from public.threads t
    where t.id = turns.thread_id and t.user_id = auth.uid()
  ));

drop policy if exists "turns via thread insert" on public.turns;
create policy "turns via thread insert" on public.turns
  for insert with check (exists (
    select 1 from public.threads t
    where t.id = turns.thread_id and t.user_id = auth.uid()
  ));

-- Responses — access via owning thread (through turn)
drop policy if exists "responses via thread select" on public.responses;
create policy "responses via thread select" on public.responses
  for select using (exists (
    select 1 from public.turns tn
    join public.threads t on t.id = tn.thread_id
    where tn.id = responses.turn_id and t.user_id = auth.uid()
  ));

drop policy if exists "responses via thread insert" on public.responses;
create policy "responses via thread insert" on public.responses
  for insert with check (exists (
    select 1 from public.turns tn
    join public.threads t on t.id = tn.thread_id
    where tn.id = responses.turn_id and t.user_id = auth.uid()
  ));

drop policy if exists "responses via thread update" on public.responses;
create policy "responses via thread update" on public.responses
  for update using (exists (
    select 1 from public.turns tn
    join public.threads t on t.id = tn.thread_id
    where tn.id = responses.turn_id and t.user_id = auth.uid()
  ));
