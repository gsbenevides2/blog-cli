import fs from 'fs'
import path from 'path'
import rmrf from 'rmrf'

export const assentFolderPath = path.resolve(process.cwd(), 'assents')

export function prepareAssentFolder(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(assentFolderPath)) {
      rmrf(
        assentFolderPath /* fs, error => {
        if (error */
      ) /* {
          reject(error)
        } else { */
      fs.mkdirSync(assentFolderPath)
      resolve()
      /* }
		}) */
    } else {
      fs.mkdirSync(assentFolderPath)
      resolve()
    }
  })
}

export function getAssentPath(name: string): string {
  return path.resolve(assentFolderPath, name)
}
