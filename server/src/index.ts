import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { doctorsRouter } from './routes/doctors'
import { appointmentsRouter } from './routes/appointments'
import { handleRazorpayWebhook, paymentsRouter } from './routes/payments'

const app = express()
const port = Number(process.env.PORT ?? 4000)
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

app.use(
  cors({
    origin: corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Idempotency-Key'],
    exposedHeaders: ['Idempotency-Key'],
  }),
)

// Webhook needs the raw body for HMAC verification (before json parser)
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(String(req.body ?? ''))
      const signature = req.header('x-razorpay-signature') ?? undefined
      const result = await handleRazorpayWebhook(raw, signature)
      res.status(result.status).json(result.body)
    } catch (err) {
      console.error('[POST /api/payments/webhook]', err)
      res.status(500).json({ error: 'Webhook handler failed' })
    }
  },
)

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'curabiz-hospital-api',
    time: new Date().toISOString(),
  })
})

app.use('/api/doctors', doctorsRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/payments', paymentsRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[unhandled]', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Curabiz API listening on http://0.0.0.0:${port}`)
})
