import firebaseAdmin from 'firebase-admin'
import '../setup'

export async function getBlogFcmTokens(): Promise<string[]> {
  const documentSnapshot = await firebaseAdmin
    .firestore()
    .doc(`apps/${process.env.POST_CHANNEL}/others/fcm`)
    .get()
  const blogTokens = documentSnapshot.get('blogTokens')
  if (!blogTokens) return []
  else return blogTokens as string[]
}
