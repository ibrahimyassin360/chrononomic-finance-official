import { ethers } from 'ethers'

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001'

export interface MetaTxPayload {
  userAddress: string
  nonce: number
  timestamp: number
  signature: string
}

export async function relayMint(payload: MetaTxPayload): Promise<string> {
  const res = await fetch(`${API_BASE}/api/relay-mint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Relay mint failed')
  const data = await res.json()
  return data.txHash as string
}

/**
 * Sign the mint meta-transaction payload using the user's wallet.
 * Timestamp must be within 5 minutes of backend time.
 */
export async function signMintPayload(address: string, provider: ethers.Signer, nonce: number): Promise<MetaTxPayload> {
  const timestamp = Date.now()
  const message = ethers.utils.solidityKeccak256(['address','uint256','uint256'], [address, nonce, timestamp])
  const signature = await provider.signMessage(ethers.utils.arrayify(message))
  return { userAddress: address, nonce, timestamp, signature }
}
