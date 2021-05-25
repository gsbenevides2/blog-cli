import path from 'path'

export const postFolder = path.resolve(process.cwd(), 'post')
export const contentFile = path.resolve(postFolder, 'content.md')
export const assentsFolder = path.resolve(postFolder, 'assents')
export const thumbnailFolder = path.resolve(postFolder, 'thumbnails')
export const thumbnailFile = {
  originalWebp: path.resolve(thumbnailFolder, 'original.webp'),
  list: path.resolve(thumbnailFolder, 'list.webp'),
  originalPng: path.resolve(thumbnailFolder, 'original.png'),
  metaTag: path.resolve(thumbnailFolder, 'metaTag.png')
}
