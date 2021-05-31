import { downloadFile } from '../../utils/download'
import { originalPngThumbnailPath } from './path'

export async function downloadThumbmail(thumbnailUrl: string): Promise<void> {
  await downloadFile(thumbnailUrl, originalPngThumbnailPath)
}
