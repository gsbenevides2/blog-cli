import fs from 'fs'
import path from 'path'

export const assentFolderPath = path.resolve(process.cwd(), 'assents')

export function prepareAssentFolder(): Promise<void> {
  return new Promise<void>(resolve => {
    if (fs.existsSync(assentFolderPath)) {
      fs.rmdirSync(assentFolderPath, { recursive: true })
      fs.mkdirSync(assentFolderPath)
      resolve()
    } else {
      fs.mkdirSync(assentFolderPath)
      resolve()
    }
  })
}

export function getAssentPath(name: string): string {
  return path.resolve(assentFolderPath, name)
}
