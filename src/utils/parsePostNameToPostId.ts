/** Converte o nome de um post em id */
export default (postName: string): string =>
  postName.toLowerCase().split(' ').join('-')
