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

export function setupWebSocket(server: Server): void {
  const io = new SocketIoServer(server, {
    cors: {
      origin: '*'
    }
  })

  io.on('connection', socket => {
    socket.on('sendPost', (data: SendPostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('message', {
          type: 'error',
          message: 'Senha Incorreta.'
        })
      } else {
        sendPost(data.notionPageUrl, message => {
          socket.emit('message', message)
        }).then(sendPostContinue => {
          socket.on('finish', () => {
            if (sendPostContinue) sendPostContinue()
          })
        })
      }
    })

    socket.on('updatePost', (data: UpdatePostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('message', {
          type: 'error',
          message: 'Senha Incorreta.'
        })
      } else {
        updatePost(data.notionPageUrl, message => {
          socket.emit('message', message)
        }).then(updatePostContinue => {
          socket.on('finish', () => {
            if (updatePostContinue) updatePostContinue()
          })
        })
      }
    })

    socket.on('deletePost', (data: DeletePostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('message', {
          type: 'error',
          message: 'Senha Incorreta.'
        })
      } else {
        deletePost(data.postName, message => {
          socket.emit('message', message)
        })
      }
    })
  })
}
