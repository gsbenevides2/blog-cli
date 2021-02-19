import * as firebaseAdmin from 'firebase-admin'
import * as log from './log'
type FirebaseAdmin = typeof firebaseAdmin

export default function loadFirebase(): FirebaseAdmin {
  function readCredentials() {
    if (!process.env.FIREBASE_ADMIN_CREDENTIALS) {
      log.error('Not found credentials')
      return ''
    } else {
      const data = Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS, 'base64')
      return JSON.parse(data.toString('utf8'))
    }
  }
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(readCredentials()),
      storageBucket: 'gs://site-do-guilherme.appspot.com'
    })
  }
  return firebaseAdmin
}
