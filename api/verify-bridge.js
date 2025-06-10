const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Placeholder verification using a mock ML service
router.post('/', upload.single('image'), async (req, res) => {
  // In production, call TensorFlow Lite or cloud vision API here
  const confidence = Math.random() * 0.5 + 0.5 // random 0.5-1.0
  const bridgeDetected = confidence > 0.6
  res.json({ bridgeDetected, confidence })
})

module.exports = router
