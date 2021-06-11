// import fs from 'fs'
// import sharp from 'sharp'
import webp from 'webp-converter'

export async function convertToWebp(
  input: string,
  output: string
): Promise<void> {
  /*
	return new Promise((resolve, reject) => {
			sharp(input)
					.webp()
					.toBuffer(async (err, buf) => {
							if (err) reject(err)
							else {
									fs.writeFileSync(output, buf)
									resolve()
							}
					})
			resolve()
})
*/
  await webp.cwebp(input, output, '-q 80')
}
