import { uploadFile } from '../firebase/storage/uploadFile'
import { getAssentPath } from './path'
import { Assent } from './types'

export function uploadAssents(
  assents: Assent[],
  postId: string
): Promise<Assent[]> {
  return Promise.all(
    assents.map(async assent => {
      const newAssent = { ...assent }
      const storagePath = `apps/${process.env.POST_CHANNEL}/postsOfBlog/${postId}/assents/${assent.name}`
      const filePath = getAssentPath(assent.name)
      newAssent.url = await uploadFile(storagePath, filePath)
      return newAssent
    })
  )
}
