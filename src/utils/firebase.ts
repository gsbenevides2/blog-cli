import * as firebaseAdmin from 'firebase-admin'
import * as log from './log'
type FirebaseAdmin = typeof firebaseAdmin

/** Inicia e configura o Firebase Admin SDK */
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
    const credentials = readCredentials()
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(credentials),
      storageBucket: `gs://${credentials.project_id}.appspot.com`
    })
  }
  return firebaseAdmin
}
