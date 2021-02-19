import loadFirebase from '../utils/firebase'
import * as log from '../utils/log'
import getFirestoreReference from '../utils/getFirestorePostReference'
import parsePostNameToPostId from '../utils/parsePostNameToPostId'
const firebase = loadFirebase()

export default async function start(postName: string): Promise<void> {
  const postId = parsePostNameToPostId(postName)
  log.info(`Deletando: ${postId}`)
  const documentReference = getFirestoreReference(postId)
  async function deletePostInFirestore() {
    await documentReference.delete()
  }
  log.info('Deletando no Firestore')
  await deletePostInFirestore()
  async function deleteAssetsInStorage() {
    await firebase
      .storage()
      .bucket()
      .deleteFiles({
        prefix: `postsOfBlog/${postId}`
      })
  }
  log.info('Deletando no Storage')
  await deleteAssetsInStorage()
  log.success('Deletado com succeso')
}
