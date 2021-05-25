import { GifData } from './gifs'
import { ImageData } from './images'
import { ThumbnailData } from './thumbnail'

export interface PostData {
  id: string
  name: string
  content: string
  description: string
  keywords: string[]
  thumbnail: ThumbnailData
  images: ImageData[]
  gifs: GifData[]
  date: Date
}
