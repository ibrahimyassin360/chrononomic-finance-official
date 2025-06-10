const express = require('express')
const { ethers } = require('ethers')
const router = express.Router()

const RELAY_PRIVATE_KEY = process.env.RELAY_PRIVATE_KEY
const RPC_URL = process.env.RPC_URL
const CONTRACT_ADDRESS = process.env.PRINTER_ADDRESS
const ABI = [ 'function mintχ(address to, uint256 amount) external' ]

const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const wallet = new ethers.Wallet(RELAY_PRIVATE_KEY, provider)
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)

let nonces = new Map()

router.post('/', express.json(), async (req, res) => {
  const { userAddress, nonce, timestamp, signature } = req.body
  if (!userAddress || !nonce || !timestamp || !signature) {
    return res.status(400).json({ error: 'Invalid payload' })
  }
  if (Math.abs(Date.now() - timestamp) > 5 * 60 * 1000) {
    return res.status(400).json({ error: 'Stale transaction' })
  }
  const lastNonce = nonces.get(userAddress) || 0
  if (nonce <= lastNonce) return res.status(400).json({ error: 'Nonce too low' })

  const message = ethers.utils.solidityKeccak256(['address','uint256','uint256'], [userAddress, nonce, timestamp])
  const recovered = ethers.utils.verifyMessage(ethers.utils.arrayify(message), signature)
  if (recovered.toLowerCase() !== userAddress.toLowerCase()) {
    return res.status(400).json({ error: 'Bad signature' })
  }
  try {
    const tx = await contract.mintχ(userAddress, ethers.utils.parseUnits('20', 18))
    nonces.set(userAddress, nonce)
    await tx.wait()
    res.json({ txHash: tx.hash })
  } catch (e) {
    res.status(500).json({ error: 'Mint failed', details: e.message })
  }
})

module.exports = router
