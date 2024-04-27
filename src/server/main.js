import express from 'express'
import ViteExpress from 'vite-express'
import mongoose from 'mongoose'
import 'dotenv/config'
const app = express()

// Middleware
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(process.env.MSG_DB_SUCCESS))
  .catch((err) => console.error(process.env.MSG_DB_ERROR, err))

// Routes
import authRoutes from './routes/authRoutes.js'
import itemRoutes from './routes/itemRoutes.js'
import userRoutes from './routes/userRoutes.js'

app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/users', userRoutes)

app.get('/hello', (req, res) => {
  res.send('Hello Vite + React!')
})

// Server Start
const PORT = process.env.PORT || 3000
ViteExpress.listen(app, PORT, () => console.log(`${process.env.MSG_SERVER_RUN} ${PORT}`))
