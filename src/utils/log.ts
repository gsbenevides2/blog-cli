import colors from 'colors'

export function error(message: string): void {
  throw new Error(`${colors.red.bold('X')}${colors.red(` Erro: ${message}`)}`)
}
export function success(message: string): void {
  console.log(
    `${colors.green.bold('✓')}${colors.green(` Sucesso! ${message}`)}`
  )
}
export function info(message: string): void {
  console.log(`${colors.bold('i')} Info: ${message}`)
}
