import colors from 'colors'

/** Exibe uma mensagem de erro */
export function error(message: string): void {
  console.log(`${colors.red.bold('X')}${colors.red(` Erro: ${message}`)}`)
  process.exit(5)
}
/** Exibe uma mensagem de sucesso */
export function success(message: string): void {
  console.log(
    `${colors.green.bold('✓')}${colors.green(` Sucesso! ${message}`)}`
  )
  process.exit(0)
}
/** Exibe uma mensagem informativa */
export function info(message: string): void {
  console.log(`${colors.bold('i')} Info: ${message}`)
}
