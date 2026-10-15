# Curabiz Hospital API

Express + Prisma backend matching the EHR MySQL table schemas (`customer`, `userdetails`, `doctorvisitdetails`, `appointment`, `appointmentpaymentdetails`, `medicalspecialties`) on Supabase Postgres, with Razorpay checkout.

## Setup

1. Copy `.env.example` → `.env` and set your Supabase password in both URLs.
2. Use the **transaction pooler** (`:6543`, `?pgbouncer=true`) for `DATABASE_URL`.
3. Use a **direct** connection for `DIRECT_URL` (Prisma Migrate / `db push`). Prefer the direct host from Supabase → Database settings (port `5432`).
4. Add Razorpay test/live keys when ready.

```bash
cd server
npm install
npm run db:setup    # generate client + push schema + seed doctors
npm run dev         # http://localhost:4000
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/doctors` | Doctors with visit fees / OPD hours |
| GET | `/api/doctors/:id` | Single doctor |
| GET | `/api/doctors/meta/specialties` | Medical specialties |
| POST | `/api/appointments` | Create patient + appointment |
| GET | `/api/appointments/:id` | Appointment detail |
| GET | `/api/payments/config` | Whether Razorpay is configured |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify signature + mark paid |
| POST | `/api/payments/confirm-free` | Free / simulated confirm |

### Payment mapping (no new columns)

- `PAYMENTMETHOD = 5` → Razorpay / online
- `BANKNAME` → Razorpay `order_id`
- `CCTRANSACTIONID` → Razorpay `payment_id` (or `PENDING` / `FREE`)

## Frontend

Vite proxies `/api` → `http://localhost:4000`. Run the API and `npm run dev` in the project root together.
