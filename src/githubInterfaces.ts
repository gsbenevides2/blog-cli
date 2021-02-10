export interface Author {
  name: string
  email: string
  date: Date
}
export interface Committer {
  name: string
  email: string
  date: Date
}

export interface Tree {
  url: string
  sha: string
}

export interface Verification {
  verified: boolean
  reason: string
  signature?: any
  payload?: any
}

export interface Commit {
  url: string
  author: Author
  committer: Committer
  message: string
  tree: Tree
  comment_count: number
  verification: Verification
}

export interface Author2 {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface Committer2 {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface Parent {
  url: string
  sha: string
}

export interface ListCommits {
  url: string
  sha: string
  node_id: string
  html_url: string
  comments_url: string
  commit: Commit
  author: Author2
  committer: Committer2
  parents: Parent[]
}
