# Supabase setup — apply database schema

This document shows two safe ways to apply the SQL in `supabase/schema.sql` so your local app finds the `damage_reports` table.

> Required env vars (set these in `.env.local`):
> - `NEXT_PUBLIC_SUPABASE_URL` (project URL)
> - `SUPABASE_SERVICE_ROLE_KEY` (service role key)

Option A — Web Console (recommended)
- Open your Supabase project in the browser.
- Go to **SQL Editor** → **New query**.
- Open `supabase/schema.sql` in your editor, copy its contents, paste into the SQL Editor.
- Click **Run**. Confirm tables `damage_reports`, `report_photos`, `report_updates` are created.
- Go to **Storage** → **Create bucket** and create bucket named `damage-report-photos` (set as **Public**).

Option B — CLI / psql (advanced)
Prerequisites: `supabase` CLI or `psql` client and the DB connection string (from Supabase project settings → Database → Connection string → psql).

1. Install `psql` (Windows via Postgres installer or `choco install postgresql`), or use the Supabase web shell.
2. From PowerShell, run (replace `<DB_CONN>` with the connection string):

```powershell
psql "<DB_CONN>" -f supabase/schema.sql
```

Notes on `supabase` CLI:
- You can install with `npm i -g supabase` or use `npx supabase`.
- CLI can help manage local development, but applying raw SQL still usually uses `psql` or the web SQL editor.

Verification
- After running the SQL, restart the dev server: 

```powershell
npm run dev
```

- Visit `http://localhost:3001/admin` — the Supabase error banner should be gone and counts will reflect DB rows.

If you want, I can:
- Add an npm script that prints a helpful reminder and checks env vars, or
- Add a small `README.md` snippet into the main README. Which do you prefer?