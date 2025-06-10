const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001'

export interface TrainingMeta {
  verified: boolean
  confidence: number
}

export async function cacheTrainingImage(image: Blob, meta: TrainingMeta): Promise<void> {
  const formData = new FormData()
  formData.append('image', image)
  formData.append('meta', JSON.stringify(meta))
  await fetch(`${API_BASE}/api/cache-training-image`, {
    method: 'POST',
    body: formData,
  })
}
