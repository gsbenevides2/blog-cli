import { Thumbnail } from './types'

const previewUrl = process.env.URL

export function getThumbnailPreview(): Omit<Thumbnail, 'alt'> {
  return {
    list: `${previewUrl}/thumbnail/list.webp`,
    metaTag: `${previewUrl}/thumbnail/metaTag.png`,
    originalPng: `${previewUrl}/thumbnail/original.png`,
    originalWebp: `${previewUrl}/thumbnail/original.webp`
  }
}
