import { cacheTrainingImage } from '../src/services/TrainingDataCache'

(global as any).fetch = jest.fn(() => Promise.resolve({ ok: true }))

describe('TrainingDataCache', () => {
  it('sends image and meta', async () => {
    const blob = new Blob(['x'])
    await cacheTrainingImage(blob, { verified: true, confidence: 1 })
    expect((global as any).fetch).toHaveBeenCalled()
  })
})
