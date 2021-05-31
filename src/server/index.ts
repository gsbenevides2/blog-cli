import cors from 'cors'
import express from 'express'
import http from 'http'

import { serverPreviewRouter } from '../modules/preview/server'
import { setupWebSocket } from './websocket'

const app = express()
app.use(cors())
app.use(serverPreviewRouter)
const server = http.createServer(app)

const port = process.env.PORT || 3000
setupWebSocket(server)
server.listen(port, () => {
  console.log('Servidor rodando')
})
