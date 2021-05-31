import { uploadFile } from '../firebase/storage/uploadFile'
import {
  listThumbnailPath,
  metaTagThumbnailPath,
  originalPngThumbnailPath,
  originalWebpThumbnailPath
} from './path'
import { Thumbnail } from './types'

type Urls = Omit<Thumbnail, 'alt'>

export async function uploadThumbnais(postId: string): Promise<Urls> {
  async function upload(name: string, path: string) {
    const storagePath = `apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}/thumbnail/${name}`
    const url = await uploadFile(storagePath, path)
    return url
  }
  return {
    list: await upload('list.webp', listThumbnailPath),
    metaTag: await upload('metaTag.png', metaTagThumbnailPath),
    originalWebp: await upload('original.webp', originalWebpThumbnailPath),
    originalPng: await upload('original.png', originalPngThumbnailPath)
  }
}
