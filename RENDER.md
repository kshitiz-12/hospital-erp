# Deploy Curabiz Hospital on Render

Repo already includes `render.yaml` (API + static site).

## 1. Push code to GitHub

```bash
git add .
git commit -m "Add Render deploy config for API and static site"
git push origin main
```

## 2. Create Blueprint

1. Open [https://dashboard.render.com](https://dashboard.render.com)
2. **New** → **Blueprint**
3. Connect `kshitiz-12/hospital-erp` (or your fork)
4. Apply `render.yaml`

## 3. Set API environment variables

On **curabiz-hospital-api** → **Environment**:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Supabase **transaction pooler** URI (`:6543` + `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase **direct** URI (`db.…supabase.co:5432`) |
| `CORS_ORIGIN` | `https://hospital-erp-ten.vercel.app` (your Vercel site) |
| `RAZORPAY_KEY_ID` | optional until live payments |
| `RAZORPAY_KEY_SECRET` | optional until live payments |

## 4. Frontend on Vercel

Site: [https://hospital-erp-ten.vercel.app](https://hospital-erp-ten.vercel.app/)

API primary URL: `https://hospital-erp-jqoc.onrender.com`

In Vercel → Project → **Settings** → **Environment Variables**:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://hospital-erp-jqoc.onrender.com/api` |

Then **Redeploy** the Vercel project (Vite bakes this in at build time).

## 5. Verify

- API: `https://hospital-erp-jqoc.onrender.com/api/health`
- Site: `https://hospital-erp-ten.vercel.app`

Free web services sleep after idle time — first request can take ~30–60s.
