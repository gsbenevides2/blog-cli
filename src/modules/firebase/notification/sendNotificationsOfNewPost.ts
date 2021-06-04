import firebaseAdmin from 'firebase-admin'

import { getBlogFcmTokens } from '../firestore/getBlogFcmTokens'
import '../setup'

export async function sendNotificationsOfNewPost(
  postName: string,
  postId: string,
  postImage: string
): Promise<void> {
  const fcmTokens = await getBlogFcmTokens()
  await firebaseAdmin.messaging().sendMulticast({
    tokens: fcmTokens,
    notification: {
      title: 'Venha ver 🏃. Tem um novo post em meu blog.',
      body: postName,
      imageUrl: postImage
    },
    webpush: {
      notification: {
        title: 'Venha ver 🏃. Tem um novo post em meu blog.',
        body: postName,
        imageUrl: postImage,
        icon: '/profile.png'
      },
      fcmOptions: {
        link: `/blog/post/${postId}`
      },
      headers: {
        image: postImage
      }
    }
  })
}
