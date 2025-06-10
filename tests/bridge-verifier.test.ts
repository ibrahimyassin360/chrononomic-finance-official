import { verifyBridge } from '../src/services/BridgeVerifier'

// Mock global fetch
(global as any).fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({ bridgeDetected: true, confidence: 0.9 }) })
)

describe('BridgeVerifier', () => {
  it('calls API and returns result', async () => {
    const blob = new Blob(['x'])
    const res = await verifyBridge(blob)
    expect(res.bridgeDetected).toBe(true)
    expect(res.confidence).toBe(0.9)
  })
})
