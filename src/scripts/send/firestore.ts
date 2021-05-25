import initFirebase from '../../utils/firebase'
import * as log from '../../utils/log'
import { PostData } from './types'

const firebase = initFirebase()

export async function sendPost(postData: PostData): Promise<void> {
  log.info('Enviando post para o Firebase Cloud Firestore')
  const postFirestoreDocument = firebase
    .firestore()
    .doc(`apps/${process.env.POST_CHANNEL}/postsOfBlog/${postData.id}`)
  await postFirestoreDocument.set(
    {
      ...postData,
      views: []
    },
    {
      merge: true
    }
  )
}

export async function updatePost(postData: PostData): Promise<void> {
  log.info('Enviando post para o Firebase Cloud Firestore')
  const postFirestoreDocument = firebase
    .firestore()
    .doc(`apps/${process.env.POST_CHANNEL}/postsOfBlog/${postData.id}`)
  await postFirestoreDocument.update({
    ...postData,
    date: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export async function verifyPostIfExists(postId: string): Promise<boolean> {
  const postFirestoreDocument = firebase
    .firestore()
    .doc(`apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}`)
  const documentSnapshot = await postFirestoreDocument.get()
  return documentSnapshot.exists
}

export async function deletePost(postId: string): Promise<void> {
  log.info('Deletando post no Firestore')
  const postFirestoreDocument = firebase
    .firestore()
    .doc(`apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}`)
  await postFirestoreDocument.delete()
}
