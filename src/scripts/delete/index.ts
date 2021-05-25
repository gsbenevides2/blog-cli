import 'dotenv/config'
import * as log from '../../utils/log'
import readlineSync from 'readline-sync'
import parsePostNameToPostId from '../../utils/parsePostNameToPostId'
import { deletePost } from '../send/firestore'
import { clearStorage } from '../send/storage'

async function start() {
  const name = readlineSync.question('Qual o name do post? ')
  const id = parsePostNameToPostId(name)
  await deletePost(id)
  await clearStorage(id)
  log.success('Post deletado!')
}
start()
