# Deploy ke Google Cloud Run

Panduan ini untuk project Next.js + Supabase pada folder ini.

## 1) Prasyarat

- Sudah install Google Cloud SDK (`gcloud`).
- Sudah login: `gcloud auth login`
- Sudah pilih project: `gcloud config set project <PROJECT_ID>`
- API aktif:
  - Cloud Run API
  - Artifact Registry API
  - Cloud Build API

Aktifkan cepat:

```powershell
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

## 2) Build image dan push

Dari root project:

```powershell
gcloud builds submit --tag gcr.io/<PROJECT_ID>/lapor-kerusakan:latest
```

## 3) Deploy ke Cloud Run

```powershell
gcloud run deploy lapor-kerusakan \
  --image gcr.io/<PROJECT_ID>/lapor-kerusakan:latest \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=<SUPABASE_URL>,ADMIN_ALLOWED_EMAILS=<ADMIN_EMAILS>
```

## 4) Rekomendasi aman (Secret Manager)

Jangan hardcode `SUPABASE_SERVICE_ROLE_KEY` di command. Simpan di Secret Manager:

```powershell
echo -n "<SERVICE_ROLE_KEY>" | gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=-
```

Lalu deploy dengan secret:

```powershell
gcloud run deploy lapor-kerusakan \
  --image gcr.io/<PROJECT_ID>/lapor-kerusakan:latest \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=<SUPABASE_URL>,ADMIN_ALLOWED_EMAILS=<ADMIN_EMAILS> \
  --set-secrets SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest
```

## 5) Update deploy berikutnya

Setiap ada perubahan:

```powershell
gcloud builds submit --tag gcr.io/<PROJECT_ID>/lapor-kerusakan:latest

gcloud run deploy lapor-kerusakan \
  --image gcr.io/<PROJECT_ID>/lapor-kerusakan:latest \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated
```

## Catatan

- App ini sudah memakai `output: "standalone"` agar cocok untuk Cloud Run.
- Pastikan bucket Supabase `damage-report-photos` dan tabel SQL sudah siap di project Supabase yang sama.
- Buat akun Supabase Auth untuk admin, lalu set `ADMIN_ALLOWED_EMAILS` berisi email admin yang diizinkan login, dipisahkan koma jika lebih dari satu.
