import colors from 'colors'

export function error(message: string): void {
  console.log(`${colors.red.bold('X')}${colors.red(` Erro: ${message}`)}`)
  process.exit(1)
}
export function success(message: string): void {
  console.log(
    `${colors.green.bold('✓')}${colors.green(` Sucesso! ${message}`)}`
  )
  process.exit(0)
}
export function info(message: string): void {
  console.log(`${colors.bold('i')} Info: ${message}`)
}
