#!/usr/bin/env node
import readline from 'readline-sync'
import * as log from './log'
import * as firebaseAdmin from 'firebase-admin'
import path from 'path'
import fs from 'fs'
import { v4 as generateUuid } from 'uuid'

async function start() {
  const actualDate = new Date()
  const date = `${actualDate.getDate()}/${
    actualDate.getMonth() + 1
  }/${actualDate.getFullYear()}`
  log.info('Data de Hoje: ' + date)
  loadFirebase()
  const postName = askPostName()
  const postId = parsePostNameToPostId(postName)
  await verifyIfPostExists(postId)
  log.info('Aguarde carregando...')
  let postContent = getPostContent()
  const thumbnailUrl = await uploadThumbnail(postId)
  const postAssents = getPostAssents()
  let postAssentsUrls: string[] = []
  if (postAssents.length) {
    postAssentsUrls = await uploadPostAssents(postId, postAssents)
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
    date,
    thumbnailUrl,
    postAssents,
    postAssentsUrls
  )
  log.success('Post Enviado')
}
async function loadFirebase() {
  const credentialsFilePath = path.resolve(process.cwd(), 'credentials.json')
  if (!fs.existsSync(credentialsFilePath))
    log.error(
      'Ops não localizei o arquivo de credenciais em ' + credentialsFilePath
    )
  const credentialsFileContent = JSON.parse(
    fs.readFileSync(credentialsFilePath).toString()
  )
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(credentialsFileContent),
    storageBucket: 'gs://site-do-guilherme.appspot.com'
  })
}
function askPostName(): string {
  const postName = readline.question('Qual o nome do post?')
  if (!postName) log.error('O nome da postagem é obrigatório')
  return postName
}
function parsePostNameToPostId(postName: string): string {
  return postName.toLowerCase().replace(' ', '-')
}
async function verifyIfPostExists(postId: string): Promise<void> {
  const documentSnapshot = await firebaseAdmin
    .firestore()
    .doc(`postsOfBlog/${postId}`)
    .get()
  if (documentSnapshot.exists) {
    if (
      !readline.keyInYN(
        'Uma postagem com esse nome já existe! Deseja sobrescreve-lá?'
      )
    ) {
      log.success('Nada foi feito!')
    }
  }
}
function getPostContent(): string {
  const postContentPath = path.resolve(process.cwd(), 'content.md')
  if (!fs.existsSync(postContentPath)) {
    log.error(
      'Não encontrei o arquivo com conteudo do post em: ' + postContentPath
    )
  }
  return fs.readFileSync(postContentPath).toString()
}
async function uploadThumbnail(postId: string): Promise<string> {
  const thumbnailPath = path.resolve(process.cwd(), 'thumbnail.png')
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
function getPostAssents(): string[] {
  const postAssentsFolderPath = path.resolve(process.cwd(), 'assents/')
  if (!fs.existsSync(postAssentsFolderPath)) {
    return []
  }
  return fs.readdirSync(postAssentsFolderPath)
}
function uploadPostAssents(
  postId: string,
  assents: string[]
): Promise<string[]> {
  const bucket = firebaseAdmin.storage().bucket()
  const promises = assents.map(async assent => {
    const assentPath = path.resolve(process.cwd(), 'assents', assent)
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
  date: string,
  thumbnailUrl: string,
  postAssents: string[],
  postAssentsUrls: string[]
): Promise<void> {
  await firebaseAdmin
    .firestore()
    .doc(`postsOfBlog/${postId}`)
    .set({
      name: postName,
      date,
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
start()
