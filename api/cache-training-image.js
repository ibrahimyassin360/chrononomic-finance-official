const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const upload = multer({ dest: 'training-images/' })

router.post('/', upload.single('image'), (req, res) => {
  const meta = JSON.parse(req.body.meta || '{}')
  const id = Date.now().toString()
  const dest = path.join('training-images', id + path.extname(req.file.originalname || '.jpg'))
  fs.renameSync(req.file.path, dest)
  fs.writeFileSync(dest + '.json', JSON.stringify(meta))
  res.json({ imageId: id })
})

module.exports = router
