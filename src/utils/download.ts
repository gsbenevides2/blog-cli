import { https } from 'follow-redirects'
import fs from 'fs'
import * as log from './log'

export function downloadFile(url: string, output: string): Promise<void> {
  return new Promise<void>(resolve => {
    const file = fs.createWriteStream(output)
    const request = https.get(url, response => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    })
    request.on('error', () => {
      fs.unlinkSync(output)
      log.error('Erro ao fazer download:' + url)
    })
  })
}
