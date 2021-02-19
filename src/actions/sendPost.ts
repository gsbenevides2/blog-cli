import * as log from '../utils/log'
import loadFirebase from '../utils/firebase'
import path from 'path'
import fs from 'fs'
import { v4 as generateUuid } from 'uuid'
import getFirestorePostReference from '../utils/getFirestorePostReference'
import parsePostNameToPostId from '../utils/parsePostNameToPostId'

const firebase = loadFirebase()

export default async function start(postName: string): Promise<void> {
  const postId = parsePostNameToPostId(postName)
  log.info(`Enviando: ${postId}`)
  let postContent = getPostContent(postName)
  const thumbnailUrl = await uploadThumbnail(postName, postId)
  const postAssents = getPostAssents(postName)
  let postAssentsUrls: string[] = []
  if (postAssents.length) {
    postAssentsUrls = await uploadPostAssents(postName, postId, postAssents)
    postContent = replaceAssentsUrlsInContent(
      postContent,
      postAssents,
      postAssentsUrls
    )
  }
  await uploadPostToFirestore(
    postId,
    postName,
    postContent,
    thumbnailUrl,
    postAssents,
    postAssentsUrls
  )
  await sendNotifications({
    name: postName,
    id: postId,
    thumbnailUrl
  })
  log.success('Post Enviado')
}
function getPostContent(postName: string): string {
  const postContentPath = path.resolve(
    process.cwd(),
    'posts',
    postName,
    'content.md'
  )
  if (!fs.existsSync(postContentPath)) {
    log.error(
      'Não encontrei o arquivo com conteudo do post em: ' + postContentPath
    )
  }
  return fs.readFileSync(postContentPath).toString()
}
async function uploadThumbnail(
  postName: string,
  postId: string
): Promise<string> {
  const thumbnailPath = path.resolve(
    process.cwd(),
    'posts',
    postName,
    'thumbnail.png'
  )
  if (!fs.existsSync(thumbnailPath)) {
    log.error('Não foi possivel encontrar a thumb em: ' + thumbnailPath)
  }
  const bucket = firebase.storage().bucket()
  const thumbnailFile = bucket.file(`postsOfBlog/${postId}/thumbnail.png`)
  await thumbnailFile.save(fs.readFileSync(thumbnailPath))
  const uuid = generateUuid()

  await thumbnailFile.setMetadata({
    metadata: {
      firebaseStorageDownloadTokens: uuid
    }
  })
  return `https://firebasestorage.googleapis.com/v0/b/site-do-guilherme.appspot.com/o/${encodeURIComponent(
    'postsOfBlog/' + postId + '/thumbnail.png'
  )}?alt=media&token=${uuid}`
}
function getPostAssents(postName: string): string[] {
  const postAssentsFolderPath = path.resolve(
    process.cwd(),
    'posts',
    postName,
    'assents/'
  )
  if (!fs.existsSync(postAssentsFolderPath)) {
    return []
  }
  return fs.readdirSync(postAssentsFolderPath)
}
function uploadPostAssents(
  postName: string,
  postId: string,
  assents: string[]
): Promise<string[]> {
  const bucket = firebase.storage().bucket()
  const promises = assents.map(async assent => {
    const assentPath = path.resolve(
      process.cwd(),
      'posts',
      postName,
      'assents',
      assent
    )
    const assentFile = bucket.file(`postsOfBlog/${postId}/assents/${assent}`)
    await assentFile.save(fs.readFileSync(assentPath))
    const uuid = generateUuid()

    await assentFile.setMetadata({
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    })
    return `https://firebasestorage.googleapis.com/v0/b/site-do-guilherme.appspot.com/o/${encodeURIComponent(
      `postsOfBlog/${postId}/assents/${assent}`
    )}?alt=media&token=${uuid}`
  })
  return Promise.all(promises)
}
function replaceAssentsUrlsInContent(
  postContent: string,
  postAssent: string[],
  postAssentsUrls: string[]
): string {
  postAssent.forEach((assent, index) => {
    postContent = postContent.replace(
      `/assents/${assent}`,
      postAssentsUrls[index]
    )
  })
  return postContent
}
async function uploadPostToFirestore(
  postId: string,
  postName: string,
  postContent: string,
  thumbnailUrl: string,
  postAssents: string[],
  postAssentsUrls: string[]
): Promise<void> {
  const documentReference = getFirestorePostReference(postId)
  await documentReference.set({
    name: postName,
    date: firebase.firestore.FieldValue.serverTimestamp(),
    image: thumbnailUrl,
    content: postContent,
    assents: postAssents.map((assent, index) => {
      return {
        name: assent,
        url: postAssentsUrls[index]
      }
    })
  })
}
interface SendNotificationsPostData {
  name: string
  id: string
  thumbnailUrl: string
}
async function sendNotifications(
  postData: SendNotificationsPostData
): Promise<void> {
  async function getFcmTokens(): Promise<string[]> {
    const documentSnapshot = await firebase.firestore().doc('others/fcm').get()
    const blogTokens: string[] = documentSnapshot.data()?.blogTokens as string[]
    return blogTokens
  }
  const fcmTokens = await getFcmTokens()
  await firebase.messaging().sendMulticast({
    tokens: fcmTokens,
    notification: {
      title: 'Postagem Publicada',
      body: postData.name,
      imageUrl: postData.thumbnailUrl
    },
    webpush: {
      fcmOptions: {
        link: `/blog/post/${postData.id}`
      },
      headers: {
        image: postData.thumbnailUrl
      }
    }
  })
}
