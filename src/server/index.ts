import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import http from 'http'

import { serverPreviewRouter } from '../modules/preview/server'
import { setupWebSocket } from './websocket'

const app = express()
if (process.env.POST_CHANNEL === 'production') {
  app.use(
    cors({
      origin: 'https://gui.dev.br'
    })
  )
} else {
  app.use(cors())
}
app.use(serverPreviewRouter)
const server = http.createServer(app)

const port = process.env.PORT
setupWebSocket(server)
server.listen(port, () => {
  console.log('Servidor rodando')
})
