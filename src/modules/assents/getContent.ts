import { Assent } from './types'

export function getContent(lines: string[], assents: Assent[]): string {
  const newLines = [...lines]
  assents.forEach(assent => {
    newLines[assent.line] = `![${assent.alt}](${assent.url})`
  })
  return newLines.join('')
}
