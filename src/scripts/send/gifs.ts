import { ServiceAccount } from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { v4 as generateUuid } from 'uuid'

import initFirebase from '../../utils/firebase'
import * as log from '../../utils/log'
import * as paths from './paths'

export interface GifData {
  name: string
  url: string
  alt: string
}
const firebase = initFirebase()

async function saveGifToStorage(
  postId: string,
  fileName: string
): Promise<string> {
  const bucket = firebase.storage().bucket()

  try {
    const filePath = path.resolve(paths.assentsFolder, `${fileName}.gif`)
    const storageGifPath = `apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}/assents/${fileName}.gif`
    const storageGifFile = bucket.file(storageGifPath)
    await storageGifFile.save(fs.readFileSync(filePath))

    const uuid = generateUuid()
    await storageGifFile.setMetadata({
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    })

    const { projectId } = firebase.app().options.credential as ServiceAccount
    return `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(
      storageGifPath
    )}?alt=media&token=${uuid}`
  } catch {
    log.error(`Erro ao enviar esse arquivo: ${fileName}`)
    return ''
  }
}

export function makesGifsDatas(
  gifs: string[],
  urls: string[],
  alts: string[]
): GifData[] {
  return gifs.map((name, index) => {
    return {
      name,
      url: urls[index],
      alt: alts[index]
    }
  })
}

export async function sendGifsToStorage(
  postId: string,
  gifs: string[]
): Promise<string[]> {
  if (!gifs.length) return []
  log.info('Enviando gifs para o Firebase Storage')
  const gifsUrls = await Promise.all(
    gifs.map(gif => saveGifToStorage(postId, gif))
  )
  return gifsUrls
}
