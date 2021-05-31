import { Util } from 'notionapi-agent/dist/interfaces/notion-models/util'

export function getAuthenticatedUrl(
  id: Util.UUID,
  notionSecureUrl: Util.NotionSecureUrl,
  table: Util.Table
): string {
  return `https://notion.so/image/${encodeURIComponent(
    notionSecureUrl
  )}?id=${id}&table=${table}`
}
