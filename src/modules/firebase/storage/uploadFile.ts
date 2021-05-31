import firebaseAdmin, { ServiceAccount } from 'firebase-admin'
import fs from 'fs'
import { v4 as generateUuid } from 'uuid'
import '../setup'

const bucket = firebaseAdmin.storage().bucket()
const { projectId } = firebaseAdmin.app().options.credential as ServiceAccount

export async function uploadFile(
  storagePath: string,
  filePath: string
): Promise<string> {
  const storageImageFile = bucket.file(storagePath)
  await storageImageFile.save(fs.readFileSync(filePath))

  const uuid = generateUuid()
  await storageImageFile.setMetadata({
    metadata: {
      firebaseStorageDownloadTokens: uuid
    }
  })

  return `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(
    storagePath
  )}?alt=media&token=${uuid}`
}
