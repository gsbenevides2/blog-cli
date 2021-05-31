import { Block, SemanticString } from 'notionapi-agent/dist/interfaces'

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

export function generateContentByBlock(block: Block): string {
  if (block.type === 'text') {
    return `\n${formatBlockText(block.properties?.title || [])}\n`
  } else if (block.type === 'bulleted_list') {
    return `- ${formatBlockText(block.properties?.title || [])}\n`
  } else if (block.type === 'image') {
    return `\n![${block.properties?.caption?.[0] || ''}](${
      block.properties?.source?.[0][0] || ''
    })\n`
  } else if (block.type === 'header') {
    return `\n# ${formatBlockText(block.properties?.title || [])}\n`
  } else if (block.type === 'sub_header') {
    return `\n## ${formatBlockText(block.properties?.title || [])}\n`
  } else if (block.type === 'sub_sub_header') {
    return `\n### ${formatBlockText(block.properties?.title || [])}\n`
  } else if (block.type === 'code') {
    return [
      '\n```' + block.properties?.language?.[0]?.[0]?.toLowerCase(),
      block.properties?.title?.[0],
      '```\n'
    ].join('\n')
  } else return ''
}
