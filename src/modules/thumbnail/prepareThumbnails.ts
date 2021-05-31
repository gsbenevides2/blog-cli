import { convertToWebp } from '../../utils/convertToWebp'
import { resizeImage } from '../../utils/resizeImage'
import {
  originalPngThumbnailPath,
  originalWebpThumbnailPath,
  metaTagThumbnailPath,
  listThumbnailPath
} from './path'

export async function prepareThumbnails(): Promise<void> {
  await convertToWebp(originalPngThumbnailPath, originalWebpThumbnailPath)
  await resizeImage(originalPngThumbnailPath, metaTagThumbnailPath, {
    width: 500,
    height: 334
  })
  await convertToWebp(metaTagThumbnailPath, listThumbnailPath)
}
