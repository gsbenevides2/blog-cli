import sharp from 'sharp'

export async function convertToWebp(
  input: string,
  output: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    sharp(input)
      .webp()
      .toFile(output, err => {
        if (err) reject(err)
        else resolve()
      })
  })
}
