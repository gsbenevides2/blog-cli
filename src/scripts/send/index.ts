import 'dotenv/config'
import * as log from '../../utils/log'
import { makeAssentsArray, replacePostAssents } from './content'
import { sendPost } from './firestore'
import { makesGifsDatas, sendGifsToStorage } from './gifs'
import {
  adaptingImagesForWeb,
  makesImagesDatas,
  sendImagesToStorage
} from './images'
import { sendNotificationsOfNewPost } from './notifications'
import { downloadPostFromNotion } from './notion'
import {
  makePreviewGifsUrls,
  makePreviewImagesUrls,
  runPreviewServer
} from './preview'
import { adaptingThumbnailForWeb, sendThumbnailToStorage } from './thumbnail'
import { PostData } from './types'

async function start() {
  const postDataResult = await downloadPostFromNotion()
  await adaptingThumbnailForWeb()
  await adaptingImagesForWeb(postDataResult.images.map(image => image.name))
  const deploy = await runPreviewServer(ngrokId => {
    const previewImagesUrls = makePreviewImagesUrls(
      postDataResult.images.map(image => image.name),
      ngrokId
    )
    const previewGifsUrls = makePreviewGifsUrls(
      postDataResult.gifs.map(gif => gif.name),
      ngrokId
    )
    const gifsAssents = makeAssentsArray(
      postDataResult.gifs.map(gif => gif.name),
      postDataResult.gifs.map(gif => gif.alt),
      previewGifsUrls
    )
    const imagesAssents = makeAssentsArray(
      postDataResult.images.map(image => image.name),
      postDataResult.images.map(image => image.alt),
      previewImagesUrls
    )
    const previewPostContent = replacePostAssents(
      imagesAssents,
      gifsAssents,
      postDataResult.content
    )
    return {
      id: postDataResult.id,
      name: postDataResult.name,
      content: previewPostContent,
      description: postDataResult.description,
      date: postDataResult.date
    }
  })
  if (deploy) {
    const thumbnailsInCloudStorage = await sendThumbnailToStorage(
      postDataResult.id
    )
    const imagesInCloudStorage = await sendImagesToStorage(
      postDataResult.id,
      postDataResult.images.map(image => image.name)
    )
    const gifsInCloudStorage = await sendGifsToStorage(
      postDataResult.id,
      postDataResult.gifs.map(gif => gif.name)
    )
    const newPostContent = replacePostAssents(
      makeAssentsArray(
        postDataResult.images.map(image => image.name),
        postDataResult.images.map(image => image.alt),
        imagesInCloudStorage.map(images => images.webp)
      ),
      makeAssentsArray(
        postDataResult.gifs.map(gif => gif.name),
        postDataResult.gifs.map(gif => gif.alt),
        gifsInCloudStorage
      ),
      postDataResult.content
    )
    const postData: PostData = {
      id: postDataResult.id,
      name: postDataResult.name,
      description: postDataResult.description,
      keywords: postDataResult.keywords,
      content: newPostContent,
      images: makesImagesDatas(
        postDataResult.images.map(image => image.name),
        imagesInCloudStorage,
        postDataResult.images.map(image => image.alt)
      ),
      gifs: makesGifsDatas(
        postDataResult.gifs.map(gif => gif.name),
        gifsInCloudStorage,
        postDataResult.gifs.map(gif => gif.alt)
      ),
      thumbnail: thumbnailsInCloudStorage,
      date: postDataResult.date
    }
    await sendPost(postData)
    await sendNotificationsOfNewPost(postData)
    const postUrl = `https://${
      process.env.POST_CHANNEL === 'development' ? 'gsbenevides2-git-dev-' : ''
    }gsbenevides2.vercel.app/blog/post/${postData.id}`
    log.success('Post enviado. Veja ele na vercel em: \n' + postUrl.underline)
  } else {
    log.success('O post não foi enviado!')
  }
}
start()
