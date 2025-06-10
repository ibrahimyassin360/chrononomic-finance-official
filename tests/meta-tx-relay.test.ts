import { signMintPayload, relayMint } from '../src/services/MetaTxRelay'
import { ethers } from 'ethers'

// Mock signer
class MockSigner extends ethers.utils.SigningKey {
  constructor(privateKey: string) { super(privateKey) }
  async signMessage(array: Uint8Array): Promise<string> {
    return ethers.utils.joinSignature(this.signDigest(array))
  }
}

(global as any).fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ txHash: '0x123' }) }))

describe('MetaTxRelay', () => {
  it('signs payload and relays', async () => {
    const key = ethers.utils.randomBytes(32)
    const signer = new MockSigner(ethers.utils.hexlify(key))
    const address = ethers.utils.computeAddress(key)
    const payload = await signMintPayload(address, signer as any, 1)
    expect(payload.userAddress).toBe(address)
    const tx = await relayMint(payload)
    expect(tx).toBe('0x123')
  })
})
