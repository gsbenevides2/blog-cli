import parsePostNameToPostId from '../../utils/parsePostNameToPostId'
import { getAssentsPreview } from '../assents/getAssentsPreview'
import { getContent } from '../assents/getContent'
import { NotionPageData } from '../notion/types'
import { getThumbnailPreview } from '../thumbnail/getThumbnailPreview'

interface PostProperties {
  id: string
  name: string
  date: string
  thumbnail: string
  metaTag: string
  description: string
  content: string
  views: number
  thumbnailAlt: string
}

function convertDateObjectToString(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export function makePreviewPageProps(pageData: NotionPageData): PostProperties {
  const thumbnail = getThumbnailPreview()
  const assents = getAssentsPreview(pageData.assents)
  const content = getContent(pageData.lines, assents)

  return {
    id: parsePostNameToPostId(pageData.name),
    name: pageData.name,
    date: convertDateObjectToString(pageData.date),
    thumbnail: thumbnail.originalWebp,
    metaTag: thumbnail.metaTag,
    description: pageData.description,
    content,
    views: 0,
    thumbnailAlt: pageData.thumbnailAlt
  }
}
