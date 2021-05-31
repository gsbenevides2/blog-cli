import { createAgent } from 'notionapi-agent'
import { Page } from 'notionapi-agent/dist/interfaces/notion-models/block/basic_block'

import { getLinesAndAssents } from './getLinesAndAssents'
import { getPageProperties } from './getPageProperties'
import { NotionApiResponse, NotionPageData } from './types'

const notionApiAgent = createAgent()

export async function fetchPageData(pageId: string): Promise<NotionPageData> {
  const apiPageResponse = (await notionApiAgent.getRecordValues({
    requests: [{ id: pageId, table: 'block' }]
  })) as NotionApiResponse
  const blocksUuids = Object.keys(apiPageResponse.recordMapWithRoles.block)
  const pageUuid = blocksUuids.find(blockId => {
    return apiPageResponse.recordMapWithRoles.block[blockId].role !== 'none'
  })
  if (!pageUuid) {
    throw new Error('404')
  }
  const pageBlock = apiPageResponse.recordMapWithRoles.block[pageUuid]
    .value as Page

  const pageProperties = getPageProperties(
    pageBlock,
    apiPageResponse.recordMapWithRoles.collection
  )
  if (!pageBlock.content) {
    throw new Error('400')
  }
  const linesAndAssents = await getLinesAndAssents(pageBlock.content)
  return {
    ...pageProperties,
    ...linesAndAssents
  }
}
