import { FirebaseFirestorePostAssent } from '../firebase/firestore/post'
import { Assent } from './types'

export function getAssentsProduction(
  assents: Assent[]
): FirebaseFirestorePostAssent[] {
  const webpAssents = assents.filter(assent => {
    return assent.name.slice(-5) === '.webp'
  })
  const pngAssents = assents.filter(assent => {
    return assent.name.slice(-4) === '.png'
  })
  const gifAssents = assents.filter(assent => {
    return assent.name.slice(-4) === '.gif'
  })
  return [...pngAssents, ...gifAssents].map(assent => {
    if (assent.name.slice(-4) === '.png') {
      const webpAssent = webpAssents.find(webpAssent => {
        return webpAssent.line === assent.line
      }) as Assent
      return {
        type: 'png',
        name: assent.name.slice(0, -4),
        originalUrl: assent.url,
        webpUrl: webpAssent.url,
        alt: assent.alt
      }
    } else {
      return {
        type: 'gif',
        name: assent.name.slice(0, -4),
        originalUrl: assent.url,
        alt: assent.alt
      }
    }
  })
}
