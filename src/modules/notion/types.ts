import { GetRecordValues } from 'notionapi-agent/dist/interfaces/notion-api/v3/getRecordValues'
import {
  BlockRecord,
  CollectionRecord,
  SpaceRecord
} from 'notionapi-agent/dist/interfaces/notion-api/v3/Record'

import { Assent } from '../assents/types'

export interface NotionPageData {
  name: string
  thumbnailUrl: string
  thumbnailAlt: string
  description: string
  date: Date
  lines: string[]
  assents: Assent[]
}
export interface NotionApiResponse extends GetRecordValues.Response {
  recordMapWithRoles: {
    block: { [key: string]: BlockRecord }
    collection: { [key: string]: CollectionRecord }
    space: { [key: string]: SpaceRecord }
  }
}
