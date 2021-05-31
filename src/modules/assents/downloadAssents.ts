import { downloadFile } from '../../utils/download'
import { getAssentPath } from './path'
import { Assent } from './types'

export async function downloadAssents(assents: Assent[]): Promise<void> {
  await Promise.all(
    assents.map(assent => {
      return downloadFile(assent.url, getAssentPath(assent.name))
    })
  )
}
