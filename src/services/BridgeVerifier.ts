
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001'

export interface VerificationResponse {
  bridgeDetected: boolean
  confidence: number
}

export async function verifyBridge(image: Blob): Promise<VerificationResponse> {
  const formData = new FormData()
  formData.append('image', image)
  const res = await fetch(`${API_BASE}/api/verify-bridge`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Verification request failed')
  return res.json() as Promise<VerificationResponse>
}
