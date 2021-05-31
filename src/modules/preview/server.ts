import express from 'express'

import { assentFolderPath } from '../assents/path'
import { thumbnailFolderPath } from '../thumbnail/path'

const router = express.Router()

router.use('/assents', express.static(assentFolderPath))
router.use('/thumbnail', express.static(thumbnailFolderPath))

export const serverPreviewRouter = router
