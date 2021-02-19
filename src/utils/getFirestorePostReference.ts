import { firestore } from 'firebase-admin'
import loadFirebase from './firebase'

const firebase = loadFirebase()

export default (postId: string): firestore.DocumentReference =>
  firebase.firestore().doc(`postsOfBlog/${postId}`)
