import webp from 'webp-converter'

export async function convertToWebp(
  input: string,
  output: string
): Promise<void> {
  await webp.cwebp(input, output, '-q 100')
}
