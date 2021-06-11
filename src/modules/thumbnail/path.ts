import fs from 'fs'
import path from 'path'
import rmrf from 'rmrf'
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

const wait = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 10000)
  })
}

export function prepareThumbnailFolder(): Promise<void> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    if (fs.existsSync(thumbnailFolderPath)) {
      fs.rmdirSync(
        thumbnailFolderPath,
        { recursive: true } /*, fs, error => {
        if (error */
      ) /* {
          reject(error)
				} else { */
      fs.mkdirSync(thumbnailFolderPath)
      resolve()
      /* }
}) */
    } else {
      fs.mkdirSync(thumbnailFolderPath)
      resolve()
    }
  })
}
