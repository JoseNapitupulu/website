Deployment notes

- Environment variables required:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - `ADMIN_ALLOWED_EMAILS` (comma-separated allowlist)
  - `NEXT_PUBLIC_APP_URL` (public origin)

- Database:
  - Apply `supabase/schema.sql` to your Supabase project (or run migrations).
  - The schema includes recommended indexes (`idx_damage_reports_*` and `idx_report_updates_report_id_created_at`).

- Storage:
  - Ensure a storage bucket named `damage-report-photos` exists and is accessible by your Supabase project.

- Build (Linux/macOS):

```bash
npm ci
npm run build
npm run start # or use your preferred process manager
```

- Build (Windows notes):
  - If you encounter `.next` readlink errors on Windows CI, remove the `.next` directory before building:

```powershell
Remove-Item -Recurse -Force .next
npm run build
```

- Admin:
  - Admin pages and APIs are protected; set `ADMIN_ALLOWED_EMAILS` correctly.
  - Service role key must never be exposed to the browser.

- Optional optimizations:
  - Add DB indexes for large datasets (already present in `supabase/schema.sql`).
  - Tune pagination `limit` and client page-size selector for admin UX.

- Troubleshooting:
  - If TypeScript deprecation warnings appear for `ignoreDeprecations`, remove `baseUrl` or align local TS version.
  - Check Supabase RLS policies in `supabase/schema.sql` if access errors occur.
