import { deletePost as deletePostFirestore } from '../modules/firebase/firestore/post'
import { deleteFiles } from '../modules/firebase/storage/deleteFiles'
import { Messager } from '../server/websocket'
import parsePostNameToPostId from '../utils/parsePostNameToPostId'

export async function deletePost(
  pageName: string,
  messager: Messager
): Promise<void> {
  try {
    const postId = parsePostNameToPostId(pageName)
    messager({
      text: 'Excluindo thumbnails e assents no Storage. Aguarde...',
      type: 'info'
    })
    await deleteFiles(`apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}`)
    messager({
      text: 'Excluindo post no Firestore. Aguarde...',
      type: 'info'
    })
    await deletePostFirestore(postId)
    messager({
      text: 'Sucesso. Post deletado.',
      type: 'success'
    })
  } catch (error) {
    messager({
      text: 'Ocorreu um errro: ' + error,
      type: 'error'
    })
  }
}
