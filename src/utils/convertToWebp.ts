import fs from 'fs'
import sharp from 'sharp'
export function convertToWebp(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    sharp(input)
      .webp()
      .toBuffer((err, buf) => {
        if (err) reject(err)
        else {
          fs.writeFileSync(output, buf)
          resolve()
        }
      })
  })
}
