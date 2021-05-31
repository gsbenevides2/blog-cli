import { convertToWebp } from '../../utils/convertToWebp'
import { getAssentPath } from './path'
import { Assent } from './types'

export async function preparePngsToWeb(assents: Assent[]): Promise<Assent[]> {
  const pngAssent = assents.filter(assent => {
    return assent.name.slice(-4) === '.png'
  })
  const webAssents = await Promise.all(
    pngAssent.map(async assent => {
      const newAssent = { ...assent }
      newAssent.name = `${assent.name.slice(0, -4)}.webp`
      await convertToWebp(
        getAssentPath(assent.name),
        getAssentPath(newAssent.name)
      )
      return newAssent
    })
  )
  return [...assents, ...webAssents]
}
