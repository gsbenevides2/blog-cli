import initFirebase from '../../utils/firebase'
import * as log from '../../utils/log'
import { PostData } from './types'

const firebase = initFirebase()
const firestore = firebase.firestore()
const cloudMessaging = firebase.messaging()

async function getFcmTokens(): Promise<string[]> {
  const documentSnapshot = await firestore
    .doc(`apps/${process.env.POST_CHANNEL}/others/fcm`)
    .get()
  const blogTokens = documentSnapshot.get('blogTokens')
  if (!blogTokens) return []
  else return blogTokens as string[]
}
async function sendNotifications(
  postData: PostData,
  fcmTokens: string[],
  message: string
): Promise<void> {
  await cloudMessaging.sendMulticast({
    tokens: fcmTokens,
    notification: {
      title: message,
      body: postData.name,
      imageUrl: postData.thumbnail.metaTag
    },
    webpush: {
      fcmOptions: {
        link: `/blog/post/${postData.id}`
      },
      headers: {
        image: postData.thumbnail.metaTag
      }
    }
  })
}

export async function sendNotificationsOfNewPost(
  postData: PostData
): Promise<void> {
  log.info('Enviando as notificações via Firebase Cloud Messaging')
  const fcmTokens = await getFcmTokens()
  if (fcmTokens.length) {
    await sendNotifications(
      postData,
      fcmTokens,
      'Venha ver 🏃. Tem um novo post em meu blog.'
    )
  }
}
export async function sendNotificationsOfPostUpdate(
  postData: PostData
): Promise<void> {
  log.info('Enviando as notificações via Firebase Cloud Messaging')
  const fcmTokens = await getFcmTokens()
  if (fcmTokens.length) {
    await sendNotifications(
      postData,
      fcmTokens,
      'Tivemos uma atualização nessa postagem:'
    )
  }
}
