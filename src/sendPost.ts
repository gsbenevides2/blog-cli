import * as log from './log'
import * as firebaseAdmin from 'firebase-admin'
import path from 'path'
import fs from 'fs'
import { v4 as generateUuid } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()

export default async function start(postName: string): Promise<void> {
  loadFirebase()
  const postId = parsePostNameToPostId(postName)
  log.info('Aguarde carregando...')
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
  log.success('Post Enviado')
}
async function loadFirebase() {
  function readCredentials() {
    if (!process.env.FIREBASE_ADMIN_CREDENTIALS) {
      log.error('Not found credentials')
      return ''
    } else {
      const data = Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS, 'base64')
      return JSON.parse(data.toString('utf8'))
    }
  }
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(readCredentials()),
    storageBucket: 'gs://site-do-guilherme.appspot.com'
  })
}
function parsePostNameToPostId(postName: string): string {
  return postName.toLowerCase().replace(' ', '-')
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
  const bucket = firebaseAdmin.storage().bucket()
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
  const bucket = firebaseAdmin.storage().bucket()
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
  await firebaseAdmin
    .firestore()
    .doc(`postsOfBlog/${postId}`)
    .set({
      name: postName,
      date: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
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
