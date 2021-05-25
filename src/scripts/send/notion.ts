import fs from 'fs'
import { createAgent } from 'notionapi-agent'
import { SemanticString } from 'notionapi-agent/dist/interfaces'
import { GetRecordValues } from 'notionapi-agent/dist/interfaces/notion-api/v3/getRecordValues'
import {
  BlockRecord,
  CollectionRecord,
  SpaceRecord
} from 'notionapi-agent/dist/interfaces/notion-api/v3/Record'
import { Block } from 'notionapi-agent/dist/interfaces/notion-models/block'
import { Page } from 'notionapi-agent/dist/interfaces/notion-models/block/basic_block'
import { BlockFormat } from 'notionapi-agent/dist/interfaces/notion-models/block/block_format'
import { Image as ImageBlock } from 'notionapi-agent/dist/interfaces/notion-models/block/media'
import '../../ArrayEspecialFilterPolyFill'
import path from 'path'
import readlineSync from 'readline-sync'
import rimraf from 'rimraf'

import { downloadFile } from '../../utils/download'
import * as log from '../../utils/log'
import parsePostNameToPostId from '../../utils/parsePostNameToPostId'
import * as paths from './paths'

const agent = createAgent()

interface Assent {
  name: string
  url: string
  alt: string
}
interface NotionResponse extends GetRecordValues.Response {
  recordMapWithRoles: {
    block: { [key: string]: BlockRecord }
    collection: { [key: string]: CollectionRecord }
    space: { [key: string]: SpaceRecord }
  }
}
interface PostDataFromNotion {
  id: string
  name: string
  description: string
  keywords: string[]
  images: Assent[]
  gifs: Assent[]
  date: Date
}
interface NewBlockFormat extends BlockFormat {
  // eslint-disable-next-line camelcase
  copied_from_pointer: {
    id: string
    table: string
    // eslint-disable-next-line camelcase
    spaceId: string
  }
}
interface PageData {
  blocks: Block[]
  page: Page
  schema: { [key: string]: string }
}
interface PostData extends PostDataFromNotion {
  content: string
}

function formatBlockImageLink(url: string): string {
  const urlParts = url.split('/')
  return urlParts[urlParts.length - 1]
}
function formatUrlToFetch(id: string, format: NewBlockFormat): string {
  const encodedUri = `https://notion.so/image/${encodeURIComponent(
    format.page_cover || format.display_source || ''
  )}?id=${id}&table=${format.copied_from_pointer.table}`
  return encodedUri
}

function prepareFolder(): Promise<void> {
  return new Promise<void>(resolve => {
    if (fs.existsSync(paths.postFolder)) {
      rimraf(paths.postFolder, fs, () => {
        fs.mkdirSync(paths.postFolder)
        fs.mkdirSync(paths.assentsFolder)
        fs.mkdirSync(paths.thumbnailFolder)
        resolve()
      })
    } else {
      fs.mkdirSync(paths.postFolder)
      fs.mkdirSync(paths.assentsFolder)
      fs.mkdirSync(paths.thumbnailFolder)
      resolve()
    }
  })
}
function getIdFromLink(url: string): string {
  const parts = url.slice(22).split('-')
  const id = parts[parts.length - 1]
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(
    16,
    20
  )}-${id.slice(20)}`
}
async function fetchPageData(id: string): Promise<PageData> {
  const data = (await agent.getRecordValues({
    requests: [
      {
        id,
        table: 'block'
      }
    ]
  })) as NotionResponse
  const pageId = Object.keys(data.recordMapWithRoles.block).filter(key => {
    return data.recordMapWithRoles.block[key].role !== 'none'
  })[0]
  const page = data.recordMapWithRoles.block[pageId].value as Page
  const schema = Object.fromEntries(
    Object.keys(
      data.recordMapWithRoles.collection[page.parent_id].value?.schema || {}
    ).map(key => {
      const name =
        data.recordMapWithRoles.collection[page.parent_id].value?.schema?.[key]
          .name || ''
      return [name, key]
    })
  )
  const blocks: { [key: string]: Block } = {}
  const ordenedBlocks: Block[] = []
  await Promise.all(
    page.content?.map(async id => {
      const data = (await agent.getRecordValues({
        requests: [{ id, table: 'block' }]
      })) as NotionResponse
      Object.keys(data.recordMapWithRoles.block).forEach(key => {
        const value = data.recordMapWithRoles.block[key].value
        if (value && !blocks[key]) {
          blocks[key] = value
        }
      })
    }) || []
  )
  page.content?.forEach(key => {
    if (key !== page.id && blocks[key]) {
      ordenedBlocks.push(blocks[key])
    }
  })
  return { page, blocks: ordenedBlocks, schema }
}
function getMarkdownFromBlocks(blocks: Block[]): string {
  function formatBlockText(data: SemanticString[]): string {
    return data
      .map(value => {
        if (value.length === 1) {
          return value[0]
        } else if (value?.[1]?.[0]?.[0] === 'a') {
          return `[${value[0]}](${value[1][0][1]})`
        } else if (value?.[1]?.[0]?.[0] === 'b') {
          return `**${value[0]}**`
        } else if (value?.[1]?.[0]?.[0] === 'i') {
          return `*${value[0]}*`
        } else if (value?.[1]?.[0]?.[0] === 'c') {
          return '`' + value[0] + '`'
        } else {
          return value[0]
        }
      })
      .join('')
  }
  const lines = blocks.map(block => {
    if (block.type === 'text') {
      return `${formatBlockText(block.properties?.title || [])}\n`
    } else if (block.type === 'bulleted_list') {
      return `- ${formatBlockText(block.properties?.title || [])}`
    } else if (block.type === 'image') {
      return `![${
        block.properties?.caption?.[0]
      }](/assents/${formatBlockImageLink(
        block.properties?.source?.[0]?.[0] || ''
      )})`
    } else if (block.type === 'header') {
      return `# ${formatBlockText(block.properties?.title || [])}`
    } else if (block.type === 'sub_header') {
      return `## ${formatBlockText(block.properties?.title || [])}`
    } else if (block.type === 'sub_sub_header') {
      return `### ${formatBlockText(block.properties?.title || [])}`
    } else if (block.type === 'code') {
      return [
        '```' + block.properties?.language?.[0]?.[0]?.toLowerCase(),
        block.properties?.title?.[0],
        '```'
      ].join('\n')
    } else {
    }
  })
  return lines.filter(value => value).join('\n')
}
async function getPostDataFromPageData(
  pageData: Page,
  imagesBlock: ImageBlock[],
  schema: { [key: string]: string }
): Promise<PostDataFromNotion> {
  const name = pageData.properties?.title?.[0]?.[0] || ''
  const id = parsePostNameToPostId(name)
  const description = pageData.properties?.[schema['Descrição']]?.[0]?.[0] || ''
  const keywords =
    pageData.properties?.[schema.Keywords]?.[0]?.[0]?.split(', ') || []
  const date = pageData.properties?.[
    schema.Data
  ]?.[0]?.[1]?.[0]?.[1] as SemanticString.DateTime
  const splitDate = date.start_date.split('-').map(Number)
  const dateObject = new Date()
  dateObject.setHours(0)
  dateObject.setMinutes(0)
  dateObject.setSeconds(0)
  dateObject.setMilliseconds(0)
  dateObject.setDate(splitDate[2])
  dateObject.setMonth(splitDate[1] - 1)
  dateObject.setFullYear(splitDate[0])
  const allAssents = imagesBlock.map(image => {
    const name = formatBlockImageLink(image.properties?.source?.[0]?.[0] || '')
    const alt = image.properties?.caption?.[0]?.[0] || ''
    const url = image.format
      ? formatUrlToFetch(image.id, image.format as NewBlockFormat)
      : ''
    return { name, alt, url }
  })
  const [gifs, images] = allAssents.especialFilter(value => {
    const ext = value.name.slice(-3)
    return ext === 'gif'
  })
  return {
    id,
    name,
    description,
    keywords,
    gifs,
    images,
    date: dateObject
  }
}
async function downloadThumbnail(url: string): Promise<void> {
  log.info('Baixando thumbnail do Notion')
  await downloadFile(url, paths.thumbnailFile.originalPng)
}
async function downloadImages(assents: Assent[]): Promise<void> {
  log.info('Baixando Assents do Notion')
  await Promise.all(
    assents.map(assent => {
      return downloadFile(
        assent.url,
        path.resolve(paths.assentsFolder, assent.name)
      )
    })
  )
}

export async function downloadPostFromNotion(): Promise<PostData> {
  const url = readlineSync.question('Qual o link do notion?\n ')
  const id = getIdFromLink(url)
  log.info('Obtendo dados do Notion')
  const pageData = await fetchPageData(id)
  log.info('Trabalhando com os dados recebidos')
  const content = getMarkdownFromBlocks(pageData.blocks)
  const imagesBlock: ImageBlock[] = pageData.blocks.filter(
    block => block.type === 'image'
  ) as ImageBlock[]
  const postData = await getPostDataFromPageData(
    pageData.page,
    imagesBlock,
    pageData.schema
  )
  prepareFolder()
  if (pageData.page.format) {
    await downloadThumbnail(
      formatUrlToFetch(pageData.page.id, pageData.page.format as NewBlockFormat)
    )
  }
  await downloadImages([...postData.images, ...postData.gifs])
  return {
    ...postData,
    content,
    gifs: postData.gifs.map(gif => {
      return {
        ...gif,
        name: gif.name.slice(0, -4)
      }
    }),
    images: postData.images.map(image => {
      return {
        ...image,
        name: image.name.slice(0, -4)
      }
    })
  }
}
