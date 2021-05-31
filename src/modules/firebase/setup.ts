import { credential, initializeApp, apps } from 'firebase-admin'

function setupFirebase(): void {
  if (apps.length) {
    return
  }
  if (!process.env.FIREBASE_ADMIN_CREDENTIALS) {
    throw new Error('Credentials')
  }
  const data = Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS, 'base64')
  const serviceAccount = JSON.parse(data.toString('utf8'))
  initializeApp({
    credential: credential.cert(serviceAccount),
    storageBucket: `gs://${serviceAccount.project_id}.appspot.com`
  })
}
setupFirebase()
