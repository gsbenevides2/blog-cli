import { CollectionRecord } from 'notionapi-agent/dist/interfaces/notion-api/v3/Record'
import {
  Collection,
  SemanticString
} from 'notionapi-agent/dist/interfaces/notion-models'
import { Page } from 'notionapi-agent/dist/interfaces/notion-models/block/basic_block'

import { getAuthenticatedUrl } from './getAuthenticatedUrl'
import { parseSemanticStringDateTimeToObject } from './parseSemanticStringDateTimeToObject'

interface PageProperties {
  name: string
  thumbnailUrl: string
  thumbnailAlt: string
  description: string
  date: Date
}

export function getPageProperties(
  page: Page,
  collections: { [key: string]: CollectionRecord }
): PageProperties {
  const collection = collections[page.parent_id].value as Collection
  const propertiesIds = Object.keys(collection.schema)
  const properties = Object.fromEntries(
    propertiesIds.map(propertyId => {
      const propertyName = collection.schema[propertyId].name
      return [propertyName, propertyId]
    })
  )
  const name = page.properties?.title[0][0] || ''
  const description = page.properties?.[properties['Descrição']][0][0] || ''
  const thumbnailUrl = getAuthenticatedUrl(
    page.id,
    page.format?.page_cover || '',
    'block'
  )
  const thumbnailAlt =
    page.properties?.[properties['Descrição da Thumbnail']][0][0] || ''
  const date = parseSemanticStringDateTimeToObject(
    page.properties?.[
      properties.Data
    ][0]?.[1]?.[0]?.[1] as SemanticString.DateTime
  )
  return { name, description, thumbnailUrl, thumbnailAlt, date }
}
