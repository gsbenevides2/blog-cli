import axios from 'axios'
import * as log from './log'
import { ListCommits } from './githubInterfaces'
import sendPost from './sendPost'

const api = axios.create({
  baseURL: 'https://api.github.com'
})

function start() {
  log.info('Obtendo ultimo commit')
  getCommit().then(commitMessage => {
    if (verifyCommitMessage(commitMessage)) {
      const postsNames = getPostsNames(commitMessage)
      postsNames.forEach(sendPost)
    } else {
      log.success('Finalizado pois o ultimo commit não é novo post!')
    }
  })
}

function getPostsNames(commitMessage: string) {
  return commitMessage
    .split('\n')
    .slice(2)
    .map(postNameInMarkdown => {
      return postNameInMarkdown.slice(2)
    })
}

function verifyCommitMessage(commitMessage: string) {
  return commitMessage.split('\n')[0].includes('post: new posts')
}

async function getCommit() {
  const commit = await api.get<ListCommits[]>(
    '/repos/gsbenevides2/blog-cli/commits?per_page=1'
  )
  log.info('Ultimo commit: ' + commit.data[0].commit.message.split('\n')[0])
  return commit.data[0].commit.message
}
start()
