import 'dotenv/config'
import sendPost from '../src/actions/sendPost'
import deletePost from '../src/actions/deletePost'

const delay = (time: number) => {
  return new Promise(cb => {
    setTimeout(cb, time)
  })
}

async function test(): Promise<void> {
  console.log('Enviando Post')
  await sendPost('Teste da CLI')
  console.log('Post Enviado')
  await delay(10000)
  console.log('Deletando Post')
  await deletePost('Teste da CLI')
  console.log('Post Deletado')
}
test().then(() => {
  process.exit(0)
})
