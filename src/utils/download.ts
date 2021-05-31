import { https } from 'follow-redirects'
import fs from 'fs'

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
      throw new Error('Erro ao fazer download:' + url)
    })
  })
}
