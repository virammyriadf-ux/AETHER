# Aether

One prompt. Every AI.

A multi-model chat app — ask a question, see answers from Claude, ChatGPT, Grok,
and Gemini streamed side-by-side. This repo is production-ready: real
authentication (Supabase magic links), real database (Supabase Postgres), real
AI responses (currently Claude), and deployable to Vercel in a few clicks.

The original visual prototype lives at [`design/Aether.html`](./design/Aether.html)
for reference — the production UI reproduces it faithfully.

---

## What you need (accounts & keys)

You'll create accounts in three places. All three have free tiers.

| Service | What for | Sign up |
|---|---|---|
| **Supabase** | Database + email login | https://supabase.com |
| **Anthropic** | Claude API key | https://console.anthropic.com |
| **Vercel** *(later)* | Hosting | https://vercel.com |

You don't need ChatGPT, Gemini, or Grok keys yet — they're stubbed. You can add
them later (see "Adding more providers" below).

---

## One-time setup (≈ 10 minutes)

### 1. Install Node.js (skip if you already have it)

Download from https://nodejs.org — pick the "LTS" version. This gives you
`node` and `npm`.

Verify in a terminal:

```bash
node --version   # should print v20.x or higher
```

### 2. Clone the repo

```bash
git clone https://github.com/virammyriadf-ux/AETHER.git
cd AETHER
git checkout claude/implement-aether-design-XyHYg
npm install
```

### 3. Create your Supabase project

1. Go to https://supabase.com → **Start your project** → sign in.
2. Click **New project**. Give it a name (e.g. `aether`), pick any region
   near you, set a database password (Supabase will save it), click
   **Create new project**. Wait ~2 minutes for it to spin up.
3. In the project dashboard, go to **Project Settings** (gear icon) →
   **API**. Copy two values:
   - **Project URL** → this becomes `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this becomes `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Run the database migration

1. In Supabase dashboard → **SQL Editor** (left sidebar) → **New query**.
2. Open [`supabase/migrations/001_init.sql`](./supabase/migrations/001_init.sql)
   in this repo, copy the whole file, paste into the SQL Editor.
3. Click **Run** (bottom right). You should see "Success. No rows returned."
4. This creates the `threads`, `turns`, and `responses` tables and locks them
   down so users can only ever see their own data.

### 5. Configure email login

1. Supabase dashboard → **Authentication** → **Providers** → **Email** is on
   by default. Leave it.
2. **Authentication** → **URL Configuration**:
   - **Site URL**: `http://localhost:3000` (change to your Vercel URL once
     deployed)
   - **Redirect URLs**: add `http://localhost:3000/auth/callback` (and your
     Vercel URL + `/auth/callback` when you deploy).

### 6. Get your Claude API key

1. Go to https://console.anthropic.com → **Settings** → **API keys**
   → **Create key**. Name it "aether-dev".
2. **Copy the key now** — it's only shown once. It becomes `ANTHROPIC_API_KEY`.
3. Add a small amount of credit ($5 is plenty to start): **Billing** → **Add credits**.

### 7. Create `.env.local`

In the project root, copy the example file and fill in the values you just
collected:

```bash
cp .env.local.example .env.local
```

Open `.env.local` in any editor and paste in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 8. Run it

```bash
npm run dev
```

Open http://localhost:3000. You'll be redirected to `/login`. Enter your email,
click **Send magic link**, check your inbox, click the link — you'll land on an
empty chat. Type a question and hit send.

---

## Testing checklist

After setup, walk through this:

| What | Expected |
|---|---|
| Visit `/` | Redirects to `/login` |
| Enter email → Send | Button says "Check your inbox" |
| Click link in email | Lands on `/chat` with empty state |
| Type "Hello" → Enter | New chat appears in sidebar; Claude card streams a reply with blinking cursor; other 3 cards say "not wired up yet" |
| Refresh the page | Your conversation is still there (loaded from DB) |
| Click **+ New Chat** | Empty state again |
| Click the old chat in sidebar | Your conversation reappears |
| Click **Sign out** | Back to `/login` |
| Sign in again (different email) | You see an empty sidebar — users can't see each other's chats |

If any of those fail, check the terminal output and the browser console.

---

## Deploy to Vercel (when you're ready)

1. Push your branch to GitHub (already done).
2. https://vercel.com → **Add New…** → **Project** → pick the repo.
3. In **Environment Variables**, add all 4 from `.env.local`. For
   `NEXT_PUBLIC_SITE_URL`, use your Vercel URL (e.g. `https://aether.vercel.app`).
4. Click **Deploy**.
5. In Supabase → **Authentication** → **URL Configuration**:
   - Update **Site URL** to your Vercel URL.
   - Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**.

That's it. No special config needed — streaming works on Vercel Node runtime
out of the box (we set `maxDuration = 60` in `src/app/api/chat/route.ts`).

---

## Project layout

```
src/
├── app/
│   ├── layout.tsx                 Root HTML shell, fonts, globals.css
│   ├── page.tsx                   Redirects to /chat
│   ├── globals.css                All styles — copied 1:1 from the prototype
│   ├── login/page.tsx             Magic-link sign-in form
│   ├── auth/callback/route.ts     Exchanges the email code for a session
│   ├── chat/
│   │   ├── layout.tsx             Sidebar + main — runs on every chat page
│   │   ├── page.tsx               Empty "new chat" state
│   │   └── [threadId]/page.tsx    An existing conversation (loads turns+responses)
│   └── api/chat/route.ts          Streaming endpoint — the one real backend
├── components/
│   ├── Sidebar.tsx                Brand, incognito toggle, new-chat, history, sign-out
│   ├── TopBar.tsx                 Thread title + active AI chips + user avatar
│   ├── AIChip.tsx                 One AI pill (icon + name + model)
│   ├── ResponseCard.tsx           One streaming answer card
│   ├── Composer.tsx               The bottom text input
│   └── ChatView.tsx               Client-side chat: sends prompts, reads the stream
├── lib/
│   ├── supabase/client.ts         Browser Supabase client
│   ├── supabase/server.ts         Server Supabase client (reads cookies)
│   └── providers/
│       ├── types.ts               `ProviderAdapter` interface
│       ├── claude.ts              The one real adapter, implemented today
│       └── index.ts               Registry — add new providers here
├── middleware.ts                  Forces sign-in on every page except /login
supabase/migrations/001_init.sql   Tables + RLS policies
design/Aether.html                 Original visual prototype (reference only)
```

---

## Adding more providers (ChatGPT, Gemini, Grok)

The code is structured so each provider is one file. To add ChatGPT:

1. `npm install openai`.
2. Add `OPENAI_API_KEY=sk-...` to `.env.local`.
3. Create `src/lib/providers/openai.ts` exporting a `ProviderAdapter` — mirror
   the shape of `claude.ts`. Use the OpenAI SDK's streaming API and call
   `onDelta(chunk)` for each token.
4. In `src/lib/providers/index.ts`, import `openai` and add it to the
   `adapters` array. Remove `gpt` from the `placeholders` array (or leave it —
   the adapter will win).

Same pattern for Gemini (`@google/generative-ai`) and Grok (OpenAI-compatible
API at `https://api.x.ai/v1`).

No UI changes needed — the top bar, response cards, and DB all already handle
multiple providers.

---

## How it works (the 60-second version)

1. Middleware checks every request: no session → redirect to `/login`.
2. Login page calls `signInWithOtp()` → Supabase emails a link.
3. Clicking the link hits `/auth/callback` which swaps the code for a
   session cookie, then bounces to `/chat`.
4. `/chat/layout.tsx` loads the user's threads server-side and renders the
   sidebar + the current page.
5. When you submit a prompt, the client POSTs `{ threadId, prompt }` to
   `/api/chat`. The route:
   - creates the thread (if new) + a turn + one `responses` row per provider,
   - returns a newline-delimited JSON stream (`init`, `delta`, `done`, `error`),
   - writes the final text back to the DB when each provider finishes.
6. `ChatView.tsx` reads the stream and updates each card's text as it arrives.
7. Row-level security in Postgres guarantees one user can never read another
   user's rows, even if a bug in the API forgot to filter.

---

## Troubleshooting

- **"No AI providers are enabled"** — you're missing `ANTHROPIC_API_KEY` in
  `.env.local`. Restart `npm run dev` after editing the file.
- **Magic-link email never arrives** — check spam. Supabase free tier uses its
  own SMTP and can be slow (~1 min). For production, configure a real SMTP in
  Supabase → Authentication → SMTP Settings.
- **Clicking the link shows an error** — the redirect URL in Supabase
  auth config doesn't match. Make sure both `http://localhost:3000/auth/callback`
  and your Vercel URL + `/auth/callback` are listed.
- **Claude streams for ~10 seconds then cuts off on Vercel** — you're on Hobby
  with the default 10s cap. We set `maxDuration = 60` in the route, but a very
  long answer could still time out. Upgrade to Pro (300s) or shorten
  `max_tokens` in `src/lib/providers/claude.ts`.
