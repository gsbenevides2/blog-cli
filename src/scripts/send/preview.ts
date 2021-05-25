import express from 'express'
import ngrok from 'ngrok'
import readline from 'readline'

import * as log from '../../utils/log'
import * as paths from './paths'
const app = express()
export interface PreviewData {
  id: string
  name: string
  content: string
  description: string
  date: Date
}

export function makePreviewImagesUrls(
  images: string[],
  ngrokId: string
): string[] {
  return images.map(name => {
    return `https://${ngrokId}.ngrok.io/assents/${name}.webp`
  })
}
export function makePreviewGifsUrls(gifs: string[], ngrokId: string): string[] {
  return gifs.map(name => {
    return `https://${ngrokId}.ngrok.io/assents/${name}.gif`
  })
}

export async function runPreviewServer(
  fetchPreviewData: (ngrokId: string) => PreviewData
): Promise<boolean> {
  let ngrokId = ''
  app.get('/post', (_request, response) => {
    const previewData = fetchPreviewData(ngrokId)
    const date = `${previewData.date.getDate()}/${
      previewData.date.getMonth() + 1
    }/${previewData.date.getFullYear()}`
    response.json({
      id: previewData.id,
      name: previewData.name,
      content: previewData.content,
      description: previewData.description,
      metaTag: `https://${ngrokId}.ngrok.io/metaTag.webp`,
      views: 12,
      thumbnail: `https://${ngrokId}.ngrok.io/thumbnail.webp`,
      date,
      preview: true
    })
  })
  app.use('/assents', express.static(paths.assentsFolder))
  app.get('/metaTag.webp', (_, response) => {
    response.sendFile(paths.thumbnailFile.metaTag)
  })
  app.get('/thumbnail.webp', (_, response) => {
    response.sendFile(paths.thumbnailFile.originalWebp)
  })
  return new Promise<boolean>(resolve => {
    log.info('Inciando servidor de previsualizaçào')
    const server = app.listen(8787, async () => {
      const tunnel = await ngrok.connect({
        authtoken: process.env.NGROK_TOKEN,
        addr: 8787
      })
      ngrokId = tunnel.split('.')[0].slice(8)
      const previewUrl = `https://${
        process.env.POST_CHANNEL === 'development'
          ? 'gsbenevides2-git-dev-'
          : ''
      }gsbenevides2.vercel.app/blog/postExemple?ngrokId=${ngrokId}`
      log.info('Veja o preview desse post em:\n' + previewUrl.underline.italic)
      const r1 = readline.createInterface(process.stdin, process.stdout)
      r1.question('Deseja finalizar o deploy? [y/n] ', async result => {
        await ngrok.kill()
        r1.close()
        server.close(() => {
          resolve(result.toLowerCase() === 'y')
        })
      })
    })
  })
}
