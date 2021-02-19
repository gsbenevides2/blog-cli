export default (postName: string): string =>
  postName.toLowerCase().split(' ').join('-')
