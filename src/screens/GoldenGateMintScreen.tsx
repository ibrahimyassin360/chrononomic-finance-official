import React from 'react'
import { View, Text, Button, Image, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { isInsideSF } from '../services/GeofenceService'
import { verifyBridge } from '../services/BridgeVerifier'
import { cacheTrainingImage } from '../services/TrainingDataCache'
import { signMintPayload } from '../services/MetaTxRelay'
import { MintButton } from '../components/MintButton'
import { ethers } from 'ethers'

export const GoldenGateMintScreen: React.FC = () => {
  const [image, setImage] = React.useState<ImagePicker.ImagePickerAsset | null>(null)
  const [verified, setVerified] = React.useState(false)
  const [confidence, setConfidence] = React.useState(0)
  const [inside, setInside] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed.')
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      setInside(isInsideSF({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }))
    })()
  }, [])

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ base64: false })
    if (!result.canceled) {
      setImage(result.assets[0])
    }
  }

  const verify = async () => {
    if (!image) return
    const uri = image.uri
    const resp = await fetch(uri)
    const blob = await resp.blob()
    const vr = await verifyBridge(blob)
    setVerified(vr.bridgeDetected && vr.confidence >= 0.85)
    setConfidence(vr.confidence)
    await cacheTrainingImage(blob, { verified: vr.bridgeDetected, confidence: vr.confidence })
    if (!vr.bridgeDetected || vr.confidence < 0.85) Alert.alert('Couldn\'t verify')
  }

  const onMintSuccess = (txHash: string) => Alert.alert('Success', `20 χ minted!\n${txHash}`)
  const onMintError = (e: Error) => Alert.alert('Error', e.message)

  const signAndMintPayload = async (): Promise<any> => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    const nonce = 0 // fetch from backend or contract in production
    return signMintPayload(address, signer, nonce)
  }

  return (
    <View>
      <Button title="Take Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 300, height: 200 }} />}
      <Button title="Verify Bridge" onPress={verify} disabled={!image} />
      <MintButton
        disabled={!inside || !verified}
        getPayload={signAndMintPayload}
        onSuccess={onMintSuccess}
        onError={onMintError}
      />
    </View>
  )
}

