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
| `CORS_ORIGIN` | `https://curabiz-hospital-web.onrender.com` |
| `RAZORPAY_KEY_ID` | optional until live payments |
| `RAZORPAY_KEY_SECRET` | optional until live payments |

## 4. Frontend API URL

Static site build uses:

`VITE_API_URL=https://curabiz-hospital-api.onrender.com/api`

If Render assigns a different API hostname, update that env var and **redeploy** the static site (Vite bakes the URL at build time).

## 5. Verify

- API: `https://curabiz-hospital-api.onrender.com/api/health`
- Site: `https://curabiz-hospital-web.onrender.com`

Free web services sleep after idle time — first request can take ~30–60s.
