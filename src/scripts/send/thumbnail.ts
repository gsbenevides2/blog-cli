import fs from 'fs'
import path from 'path'
import * as log from '../../utils/log'
import { v4 as generateUuid } from 'uuid'
import initFirebase from '../../utils/firebase'
import webp from 'webp-converter'
import * as paths from './paths'
import sharp from 'sharp'
import { ServiceAccount } from 'firebase-admin'

export interface ThumbnailData {
  originalPng: string
  metaTag: string

  originalWebp: string
  list: string
}
interface Size {
  width: number
  height: number
}

const firebase = initFirebase()
async function convertToWebp(input: string, output: string) {
  await webp.cwebp(input, output, '-q 100')
}
async function resize(
  input: string,
  output: string,
  size: Size
): Promise<void> {
  await sharp(input).resize(size.width, size.height).toFile(output)
}

async function saveThumbnailFiles(postId: string): Promise<ThumbnailData> {
  log.info('Enviando os arquivos da thumbnail para o Firebase Storage')
  const bucket = firebase.storage().bucket()

  async function saveThumbnailToStorage(filePath: string): Promise<string> {
    try {
      const fileName = path.basename(filePath)
      const storageThumbnailPath = `apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}/thumbnails/${fileName}`
      const storageThumbnailFile = bucket.file(storageThumbnailPath)
      await storageThumbnailFile.save(fs.readFileSync(filePath))

      const uuid = generateUuid()
      await storageThumbnailFile.setMetadata({
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
      })
      const { projectId } = firebase.app().options.credential as ServiceAccount
      return `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(
        storageThumbnailPath
      )}?alt=media&token=${uuid}`
    } catch {
      log.error(`Erro ao enviar esse arquivo: ${filePath}`)
      return ''
    }
  }

  return {
    originalWebp: await saveThumbnailToStorage(
      paths.thumbnailFile.originalWebp
    ),
    list: await saveThumbnailToStorage(paths.thumbnailFile.list),
    originalPng: await saveThumbnailToStorage(paths.thumbnailFile.originalPng),
    metaTag: await saveThumbnailToStorage(paths.thumbnailFile.metaTag)
  }
}
export async function adaptingThumbnailForWeb(): Promise<void> {
  log.info('Adaptando thumbnail para a web.')
  await convertToWebp(
    paths.thumbnailFile.originalPng,
    paths.thumbnailFile.originalWebp
  )
  await resize(paths.thumbnailFile.originalPng, paths.thumbnailFile.metaTag, {
    width: 500,
    height: 334
  })
  await convertToWebp(paths.thumbnailFile.metaTag, paths.thumbnailFile.list)
}
export async function sendThumbnailToStorage(
  postId: string
): Promise<ThumbnailData> {
  return await saveThumbnailFiles(postId)
}
