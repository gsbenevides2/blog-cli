import Convertio from 'convertio'
import fs from 'fs'

export async function convertToWebp(
  input: string,
  output: string
): Promise<void> {
  const fsInput = fs.readFileSync(input)
  const api = new Convertio('')
  const conversion = await api.convertFromBuffer(fsInput, 'webp')
  while (true) {
    const status = await api.getStatus(conversion.id)
    if (status.stepPercent === 100) break
  }
  const result = await api.getFileContent(conversion.id)
  fs.writeFileSync(output, result)
}
