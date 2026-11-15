# Admin setup (5 minutes, free)
Your site is static, so "all visitors" data needs a small free database. Without it, admin.html works in **local mode** (this device only, protected by a passphrase you choose on first open).

1. Create a free project at supabase.com.
2. SQL Editor → paste `setup-supabase.sql` (change YOUR_EMAIL) → Run.
3. Authentication → Users → Add user: your email + a strong password (turn off public sign-ups in Auth settings).
4. Project Settings → API: copy the Project URL and the `anon public` key into `admin-config.js`.
5. Deploy, open `/admin.html`, sign in.

Security: the anon key is meant to be public. The database policies make it write-only for visitors; only your signed-in email can read events or change controls.
Notes: "Minutes watched" counts time the lecture page is open and visible (YouTube playback can't be read directly).
