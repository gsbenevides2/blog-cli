export function getPageUuidFromLink(url: string): string {
  const parts = url.slice(22).split('-')
  const id = parts[parts.length - 1]
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(
    16,
    20
  )}-${id.slice(20)}`
}
