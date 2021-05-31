import firebaseAdmin from 'firebase-admin'
import '../setup'

export type FirebaseFirestorePostAssent =
  | {
      type: 'png'
      name: string
      originalUrl: string
      webpUrl: string
      alt: string
    }
  | {
      type: 'gif'
      name: string
      originalUrl: string
      alt: string
    }

interface FirebaseFirstorePostThumbnail {
  originalPng: string
  originalWebp: string
  list: string
  metaTag: string
  alt: string
}

interface FirebaseFirestorePost {
  id: string
  name: string
  content: string
  description: string
  date: firebaseAdmin.firestore.Timestamp
  thumbnail: FirebaseFirstorePostThumbnail
  assents: FirebaseFirestorePostAssent[]
  views: string[]
}
type FirebaseFirestorePostWithoutViews = Omit<FirebaseFirestorePost, 'views'>

const postCollection = firebaseAdmin
  .firestore()
  .collection(`apps/${process.env.POST_CHANNEL}/postsOfBlog`)

export async function setPost(
  post: FirebaseFirestorePostWithoutViews
): Promise<void> {
  await postCollection.doc(post.id).set({
    ...post,
    views: []
  })
}
export async function updatePost(
  post: FirebaseFirestorePostWithoutViews
): Promise<void> {
  await postCollection.doc(post.id).update(post)
}
export async function deletePost(postId: string): Promise<void> {
  await postCollection.doc(postId).delete()
}
