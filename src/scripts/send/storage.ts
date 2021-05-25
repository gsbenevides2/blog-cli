import * as log from '../../utils/log'
import initFirebase from '../../utils/firebase'
const firebase = initFirebase()

export async function clearStorage(postId: string): Promise<void> {
  log.info('Deletando os arquivos enviados para o storage.')
  const bucket = firebase.storage().bucket()
  await bucket.deleteFiles({
    prefix: `apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}`,
    force: true
  })
}
