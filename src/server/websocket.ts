import { Server } from 'http'
import { Server as SocketIoServer } from 'socket.io'

import { deletePost } from '../operations/deletePost'
import { sendPost } from '../operations/sendPost'
import { updatePost } from '../operations/updatePost'

type SendPostData = {
  notionPageUrl: string
  password: string
}
type UpdatePostData = SendPostData
type DeletePostData = {
  postName: string
  password: string
}

export type Message = {
  text: string
  type: 'info' | 'success' | 'error' | 'data'
  data?: unknown
}

export type Messager = (message: Message) => void
export type ConfirmFunction = () => void

export function setupWebSocket(server: Server): void {
  const io = new SocketIoServer(server, {
    cors: {
      origin: '*'
    }
  })

  io.on('connection', socket => {
    let continueFunction: ConfirmFunction | void
    socket.on('finish', (password: string) => {
      if (password !== process.env.PASSWORD) {
        socket.emit('message', {
          type: 'error',
          text: 'Senha Incorreta.'
        })
      } else if (continueFunction) {
        continueFunction()
      } else {
        socket.emit('message', {
          type: 'error',
          text: 'Invalid type.'
        })
      }
    })
    socket.on('sendPost', (data: SendPostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('message', {
          type: 'error',
          text: 'Senha Incorreta.'
        })
      } else {
        sendPost(data.notionPageUrl, message => {
          socket.emit('message', message)
        }).then(sendPostContinue => {
          continueFunction = sendPostContinue
        })
      }
    })

    socket.on('updatePost', (data: UpdatePostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('message', {
          type: 'error',
          text: 'Senha Incorreta.'
        })
      } else {
        updatePost(data.notionPageUrl, message => {
          socket.emit('message', message)
        }).then(updatePostContinue => {
          continueFunction = updatePostContinue
        })
      }
    })

    socket.on('deletePost', (data: DeletePostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('message', {
          type: 'error',
          text: 'Senha Incorreta.'
        })
      } else {
        deletePost(data.postName, message => {
          socket.emit('message', message)
        })
      }
    })
  })
}
