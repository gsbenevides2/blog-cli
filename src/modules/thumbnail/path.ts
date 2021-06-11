import fs from 'fs'
import path from 'path'

export const thumbnailFolderPath = path.resolve(process.cwd(), 'thumbnail')

export const originalPngThumbnailPath = path.resolve(
  thumbnailFolderPath,
  'original.png'
)
export const originalWebpThumbnailPath = path.resolve(
  thumbnailFolderPath,
  'original.webp'
)
export const metaTagThumbnailPath = path.resolve(
  thumbnailFolderPath,
  'metaTag.png'
)
export const listThumbnailPath = path.resolve(thumbnailFolderPath, 'list.webp')
export function prepareThumbnailFolder(): Promise<void> {
  return new Promise<void>(resolve => {
    if (fs.existsSync(thumbnailFolderPath)) {
      fs.rmdirSync(thumbnailFolderPath, { recursive: true })
      fs.mkdirSync(thumbnailFolderPath)
      resolve()
    } else {
      fs.mkdirSync(thumbnailFolderPath)
      resolve()
    }
  })
}
