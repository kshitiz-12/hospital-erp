import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { doctorsRouter } from './routes/doctors'
import { appointmentsRouter } from './routes/appointments'
import { paymentsRouter } from './routes/payments'

const app = express()
const port = Number(process.env.PORT ?? 4000)
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

app.use(
  cors({
    origin: corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  }),
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
