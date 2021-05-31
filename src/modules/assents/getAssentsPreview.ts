import { Assent } from './types'

const previewUrl = process.env.URL

export function getAssentsPreview(assents: Assent[]): Assent[] {
  return assents.map(assent => {
    const newAssent = { ...assent }
    newAssent.url = `${previewUrl}/assents/${assent.name}`
    return newAssent
  })
}
