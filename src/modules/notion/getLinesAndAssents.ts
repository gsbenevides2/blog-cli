import { createAgent } from 'notionapi-agent'
import { Util } from 'notionapi-agent/dist/interfaces'
import { Image } from 'notionapi-agent/dist/interfaces/notion-models/block/media'

import { Assent } from '../assents/types'
import { generateContentByBlock } from './generateContentByBlock'
import { getAuthenticatedUrl } from './getAuthenticatedUrl'
import { NotionApiResponse } from './types'

const notionApiAgent = createAgent()

interface LinesAndAssents {
  lines: string[]
  assents: Assent[]
}

function getFileNameFromUrl(url: string) {
  const parts = url.split('/')
  return parts[parts.length - 1]
}

function verifyImageBlockToAssent(
  imageBlock: Image,
  line: number
): Assent | undefined {
  const alt = imageBlock.properties?.caption?.[0][0] || ''
  const url = imageBlock.properties?.source?.[0][0] || ''
  const name = getFileNameFromUrl(url)
  if (!url.includes('secure.notion-static.com')) return
  return {
    url: getAuthenticatedUrl(imageBlock.id, url, 'block'),
    name,
    alt,
    line
  }
}

export async function getLinesAndAssents(
  blocksId: Util.UUID[]
): Promise<LinesAndAssents> {
  const notionApiResult = (await notionApiAgent.getRecordValues({
    requests: blocksId.map(id => {
      return {
        id,
        table: 'block'
      }
    })
  })) as NotionApiResponse
  const lines: string[] = []
  const assents: Assent[] = []
  const blocksRecords = Object.values(notionApiResult.recordMapWithRoles.block)
  blocksRecords.map((block, line) => {
    if (block.value) {
      lines.push(generateContentByBlock(block.value))
      if (block.value.type === 'image') {
        const assent = verifyImageBlockToAssent(block.value, line)
        if (assent) assents.push(assent)
      }
    }
  })
  return { lines, assents }
}
