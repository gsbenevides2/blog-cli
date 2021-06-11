import sharp from 'sharp'
interface Size {
  width: number
  height: number
}
export async function resizeImage(
  input: string,
  output: string,
  size: Size
): Promise<void> {
  return new Promise((resolve, reject) => {
    sharp(input)
      .resize(size.width, size.height)
      .toFile(output, err => {
        if (err) reject(err)
        else resolve()
      })
  })
}
