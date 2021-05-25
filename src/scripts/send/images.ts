import { ServiceAccount } from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { v4 as generateUuid } from 'uuid'
import webp from 'webp-converter'

import initFirebase from '../../utils/firebase'
import * as log from '../../utils/log'
import * as paths from './paths'

type Type = 'png' | 'webp'
export interface ImageData {
  name: string
  png: string
  webp: string
  alt: string
}
interface ImageUrls {
  png: string
  webp: string
}
const firebase = initFirebase()

async function convertToWebp(name: string) {
  const input = path.resolve(paths.assentsFolder, `${name}.png`)
  const output = path.resolve(paths.assentsFolder, `${name}.webp`)
  await webp.cwebp(input, output, '-q 100')
}
async function saveImageFiles(
  postId: string,
  fileName: string
): Promise<ImageUrls> {
  const bucket = firebase.storage().bucket()

  async function saveImageToStorage(type: Type): Promise<string> {
    try {
      const filePath = path.resolve(paths.assentsFolder, `${fileName}.${type}`)
      const storageImagePath = `apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}/assents/${fileName}.${type}`
      const storageImageFile = bucket.file(storageImagePath)
      await storageImageFile.save(fs.readFileSync(filePath))

      const uuid = generateUuid()
      await storageImageFile.setMetadata({
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
      })

      const { projectId } = firebase.app().options.credential as ServiceAccount
      return `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(
        storageImagePath
      )}?alt=media&token=${uuid}`
    } catch {
      log.error(`Erro ao enviar esse arquivo: ${fileName}`)
      return ''
    }
  }

  return {
    webp: await saveImageToStorage('webp'),
    png: await saveImageToStorage('png')
  }
}

export async function adaptingImagesForWeb(images: string[]): Promise<void> {
  if (!images.length) return
  log.info('Preparando as imagens para web.')
  await Promise.all(images.map(convertToWebp))
}

export async function sendImagesToStorage(
  postId: string,
  images: string[]
): Promise<ImageUrls[]> {
  if (!images.length) return []
  log.info('Enviando imagens para o Firebase Storage')
  const imagesUrls = await Promise.all(
    images.map(image => saveImageFiles(postId, image))
  )
  return imagesUrls
}
export function makesImagesDatas(
  gifs: string[],
  urls: ImageUrls[],
  alts: string[]
): ImageData[] {
  return gifs.map((name, index) => {
    return {
      name,
      ...urls[index],
      alt: alts[index]
    }
  })
}
