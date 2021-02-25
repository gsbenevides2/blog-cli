import axios from 'axios'
import 'dotenv/config'
import * as log from './utils/log'
import { ListCommits } from './githubInterfaces'
import sendPost from './actions/sendPost'
import deletePost from './actions/deletePost'

const api = axios.create({
  baseURL: 'https://api.github.com'
})

async function start(): Promise<void> {
  log.info('Obtendo ultimo commit')
  const commitMessage = await getCommit()
  const commitType = getCommitType(commitMessage)
  if (commitType === 'new post' || commitType === 'updatePost') {
    const postsNames = getPostsNames(commitMessage)
    const promises = postsNames.map(sendPost)
    await Promise.all(promises).then(()=>{
      log.success('Finalizado, posts enviados.')
    })
  } else if (commitType === 'delete post') {
    const postsNames = getPostsNames(commitMessage)
    const promises = postsNames.map(deletePost)
    await Promise.all(promises).then(()=>{
      log.success('Finalizado, posts deletados.')
    })
  } else {
    log.success('Finalizado pois o ultimo commit não é novo post!')
  }
  process.exit(0)
}

function getPostsNames(commitMessage: string) {
  return commitMessage
    .split('\n')
    .slice(2)
    .map(postNameInMarkdown => {
      return postNameInMarkdown.slice(2)
    })
}

function getCommitType(commitMessage: string) {
  return commitMessage.split('\n')[0].split(':')[0]
}

async function getCommit() {
  const commit = await api.get<ListCommits[]>(
    '/repos/gsbenevides2/blog-cli/commits?per_page=1'
  )
  log.info('Ultimo commit: ' + commit.data[0].commit.message.split('\n')[0])
  return commit.data[0].commit.message
}
start()
