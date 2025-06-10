import React from 'react'
import { Pressable, Text, ActivityIndicator } from 'react-native'
import { relayMint, MetaTxPayload } from '../services/MetaTxRelay'

type Props = {
  disabled?: boolean
  getPayload: () => Promise<MetaTxPayload>
  onSuccess(txHash: string): void
  onError(err: Error): void
}

export const MintButton: React.FC<Props> = ({ disabled, getPayload, onSuccess, onError }) => {
  const [loading, setLoading] = React.useState(false)

  const mint = async () => {
    setLoading(true)
    try {
      const payload = await getPayload()
      const txHash = await relayMint(payload)
      onSuccess(txHash)
    } catch (e) {
      onError(e as Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pressable onPress={mint} disabled={disabled || loading}>
      {loading ? <ActivityIndicator /> : <Text>Mint 20 χ</Text>}
    </Pressable>
  )
}
