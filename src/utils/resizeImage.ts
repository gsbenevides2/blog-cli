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
  await lenna.resize(size.width, size.height).writeAsync(output)
}
