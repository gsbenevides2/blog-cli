// import fs from 'fs'
// import sharp from 'sharp'
import jimp from 'jimp'
interface Size {
  width: number
  height: number
}
export async function resizeImage(
  input: string,
  output: string,
  size: Size
): Promise<void> {
  const lenna = await jimp.read(input)
  lenna.resize(size.width, size.height).write(output)
  /*
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
*/
}
