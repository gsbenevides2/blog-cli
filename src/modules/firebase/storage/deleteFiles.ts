import firebaseAdmin from 'firebase-admin'
import '../setup'

const bucket = firebaseAdmin.storage().bucket()

export async function deleteFiles(storagePath: string): Promise<void> {
  await bucket.deleteFiles({
    prefix: storagePath,
    force: true
  })
}
