import fs from 'fs'
import sharp from 'sharp'
interface Size {
  width: number
  height: number
}
export function resizeImage(
  input: string,
  output: string,
  size: Size
): Promise<void> {
  return new Promise((resolve, reject) => {
    sharp(input)
      .resize(size.width, size.height)
      .toBuffer(async (err, buf) => {
        if (err) reject(err)
        else {
          fs.writeFileSync(output, buf)
          resolve()
        }
      })
  })
}
