interface Assent {
  name: string
  alt: string
  url: string
}

export function makeAssentsArray(
  names: string[],
  alts: string[],
  urls: string[]
): Assent[] {
  return names.map((name, index) => {
    return {
      name,
      alt: alts[index],
      url: urls[index]
    }
  })
}

export function replacePostAssents(
  images: Assent[],
  gifs: Assent[],
  content: string
): string {
  return content
    .split('\n')
    .map(value => {
      // eslint-disable-next-line no-useless-escape
      const regexPng = /!\[.*]\(\/\assents\/(?<filename>.*).png\)/gm
      const pngResult = regexPng.exec(value)
      const pngFilename = pngResult?.groups?.filename
      // eslint-disable-next-line no-useless-escape
      const regexGif = /!\[.*]\(\/\assents\/(?<filename>.*).gif\)/gm
      const gifResult = regexGif.exec(value)
      const gifFilename = gifResult?.groups?.filename

      if (pngFilename) {
        const image = images.find(image => image.name === pngFilename) as Assent
        return `![${image.alt}](${image.url})`
      } else if (gifFilename) {
        const gif = gifs.find(gif => gif.name === gifFilename) as Assent
        return `![${gif.alt}](${gif.url})`
      } else return value
    })
    .join('\n')
}
