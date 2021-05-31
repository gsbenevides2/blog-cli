import 'dotenv/config'
import { firestore } from 'firebase-admin'

import { downloadAssents } from '../modules/assents/downloadAssents'
import { getAssentsProduction } from '../modules/assents/getAssentsProduction'
import { getContent } from '../modules/assents/getContent'
import { prepareAssentFolder } from '../modules/assents/path'
import { preparePngsToWeb } from '../modules/assents/preparePngsToWeb'
import { uploadAssents } from '../modules/assents/uploadAssents'
import { setPost } from '../modules/firebase/firestore/post'
import { sendNotificationsOfNewPost } from '../modules/firebase/notification/sendNotificationsOfNewPost'
import { fetchPageData } from '../modules/notion/fetchPageData'
import { getPageUuidFromLink } from '../modules/notion/getPageUuidFromLink'
import { makePreviewPageProps } from '../modules/preview/makePreviewPageProps'
import { downloadThumbmail } from '../modules/thumbnail/downloadThumbnail'
import { prepareThumbnailFolder } from '../modules/thumbnail/path'
import { prepareThumbnails } from '../modules/thumbnail/prepareThumbnails'
import { uploadThumbnais } from '../modules/thumbnail/uploadThumbnails'
import parsePostNameToPostId from '../utils/parsePostNameToPostId'

type Message = {
  text: string
  type: 'info' | 'success' | 'error' | 'data'
  data?: unknown
}

type Messager = (message: Message) => void
type ConfirmFunction = () => void
export async function sendPost(
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
        text: 'Eviando post para Firestore. Aguarde...',
        type: 'info'
      })
      await setPost({
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
      await sendNotificationsOfNewPost(pageData.name, postId, thumbnail.metaTag)
      messager({
        text: 'Sucesso. Post enviado.',
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
