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
  const io = new SocketIoServer(server)

  io.on('connection', socket => {
    socket.on('sendPost', (data: SendPostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('incorrectPassword')
      } else {
        sendPost(data.notionPageUrl, message => {
          socket.emit('message', message)
        }).then(sendPostContinue => {
          socket.on('sendPostContinue', () => {
            if (sendPostContinue) sendPostContinue()
          })
        })
      }
    })

    socket.on('updatePost', (data: UpdatePostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('incorrectPassword')
      } else {
        updatePost(data.notionPageUrl, message => {
          socket.emit('message', message)
        }).then(updatePostContinue => {
          socket.on('updatePostContinue', () => {
            if (updatePostContinue) updatePostContinue()
          })
        })
      }
    })

    socket.on('deletePost', (data: DeletePostData) => {
      if (data.password !== process.env.PASSWORD) {
        socket.emit('incorrectPassword')
      } else {
        deletePost(data.postName, message => {
          socket.emit('message', message)
        })
      }
    })
  })
}
