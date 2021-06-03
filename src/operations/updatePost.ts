import { firestore } from 'firebase-admin'

import { downloadAssents } from '../modules/assents/downloadAssents'
import { getAssentsProduction } from '../modules/assents/getAssentsProduction'
import { getContent } from '../modules/assents/getContent'
import { prepareAssentFolder } from '../modules/assents/path'
import { preparePngsToWeb } from '../modules/assents/preparePngsToWeb'
import { uploadAssents } from '../modules/assents/uploadAssents'
import { updatePost as updatePostFirestore } from '../modules/firebase/firestore/post'
import { sendNotificationsOfUpdatePost } from '../modules/firebase/notification/sendNotificationsOfUpdatePost'
import { deleteFiles } from '../modules/firebase/storage/deleteFiles'
import { fetchPageData } from '../modules/notion/fetchPageData'
import { getPageUuidFromLink } from '../modules/notion/getPageUuidFromLink'
import { makePreviewPageProps } from '../modules/preview/makePreviewPageProps'
import { downloadThumbmail } from '../modules/thumbnail/downloadThumbnail'
import { prepareThumbnailFolder } from '../modules/thumbnail/path'
import { prepareThumbnails } from '../modules/thumbnail/prepareThumbnails'
import { uploadThumbnais } from '../modules/thumbnail/uploadThumbnails'
import { ConfirmFunction, Messager } from '../server/websocket'
import parsePostNameToPostId from '../utils/parsePostNameToPostId'

export async function updatePost(
  pageUrl: string,
  messager: Messager
): Promise<ConfirmFunction | void> {
  try {
    const pageUuid = getPageUuidFromLink(pageUrl)
    messager({
      text: 'Obtendo informações da página no notion. Aguarde...',
      type: 'info'
    })
    const pageData = await fetchPageData(pageUuid)
    messager({
      text: 'Preparando pasta para download da thumbnail. Aguarde...',
      type: 'info'
    })
    await prepareThumbnailFolder()
    messager({
      text: 'Baixando thumbnail do Notion. Aguarde...',
      type: 'info'
    })
    await downloadThumbmail(pageData.thumbnailUrl)
    messager({
      text: 'Criando thumbnails para listas, meta tags e em webp. Aguarde...',
      type: 'info'
    })
    await prepareThumbnails()
    messager({
      text: 'Preparando pasta para download dos assents. Aguarde...',
      type: 'info'
    })
    await prepareAssentFolder()
    messager({
      text: 'Baixando assents do Notion. Aguarde...',
      type: 'info'
    })
    await downloadAssents(pageData.assents)
    messager({
      text: 'Preparando assents em png para web. Aguarde...',
      type: 'info'
    })
    pageData.assents = await preparePngsToWeb(pageData.assents)
    const pageProos = makePreviewPageProps(pageData)
    messager({
      text: 'Use esses dados para visualizar a como vai ficar',
      type: 'data',
      data: pageProos
    })
    return async () => {
      const postId = parsePostNameToPostId(pageData.name)
      messager({
        text: 'Excluindo thumbnails e assents no Storage. Aguarde...',
        type: 'info'
      })
      await deleteFiles(
        `apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}`
      )
      messager({
        text: 'Enviando thumbnails para o Storage. Aguarde...',
        type: 'info'
      })
      const thumbnail = await uploadThumbnais(postId)
      messager({
        text: 'Enviando assents para o Storage. Aguarde...',
        type: 'info'
      })
      const assents = await uploadAssents(pageData.assents, postId)
      messager({
        text: 'Atualizando post para Firestore. Aguarde...',
        type: 'info'
      })
      await updatePostFirestore({
        id: postId,
        name: pageData.name,
        content: getContent(pageData.lines, assents),
        description: pageData.description,
        date: firestore.Timestamp.fromDate(pageData.date),
        thumbnail: {
          ...thumbnail,
          alt: pageData.thumbnailAlt
        },
        assents: getAssentsProduction(assents)
      })
      messager({
        text: 'Enviando notificações através da FCM. Aguarde...',
        type: 'info'
      })
      await sendNotificationsOfUpdatePost(
        pageData.name,
        postId,
        thumbnail.metaTag
      )
      messager({
        text: 'Sucesso. Post atualizado.',
        type: 'success'
      })
    }
  } catch (error) {
    messager({
      text: 'Ocorreu um errro: ' + error,
      type: 'error'
    })
  }
}
