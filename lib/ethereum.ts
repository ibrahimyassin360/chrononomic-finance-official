import { ethers } from "ethers"
import { CONTRACT_ADDRESSES, SUPPORTED_NETWORKS } from "@/config/contracts"

// ABIs
import ChrononTokenABI from "@/contracts/ChrononToken.json"
import ChrononBondABI from "@/contracts/ChrononBond.json"
import ChrononVaultABI from "@/contracts/ChrononVault.json"
import ChrononomicFinanceABI from "@/contracts/ChrononomicFinance.json"

// Check if window.ethereum is available
export const isMetaMaskAvailable = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
}

// Get the current chain ID
export const getChainId = async (): Promise<number> => {
  if (!isMetaMaskAvailable()) {
    throw new Error("MetaMask is not available")
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  return network.chainId
}

// Check if the current network is supported
export const isNetworkSupported = async (): Promise<boolean> => {
  try {
    const chainId = await getChainId()
    return SUPPORTED_NETWORKS.includes(chainId)
  } catch (error) {
    console.error("Error checking network support:", error)
    return false
  }
}

// Get contract instances
export const getContracts = async () => {
  if (!isMetaMaskAvailable()) {
    throw new Error("MetaMask is not available")
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const chainId = await getChainId()

  if (!SUPPORTED_NETWORKS.includes(chainId)) {
    throw new Error("Network not supported")
  }

  const addresses = CONTRACT_ADDRESSES[chainId]

  return {
    chrononToken: new ethers.Contract(addresses.ChrononToken, ChrononTokenABI.abi, signer),
    chrononBond: new ethers.Contract(addresses.ChrononBond, ChrononBondABI.abi, signer),
    chrononVault: new ethers.Contract(addresses.ChrononVault, ChrononVaultABI.abi, signer),
    chrononomicFinance: new ethers.Contract(addresses.ChrononomicFinance, ChrononomicFinanceABI.abi, signer),
  }
}

// Request account access
export const requestAccounts = async (): Promise<string[]> => {
  if (!isMetaMaskAvailable()) {
    throw new Error("MetaMask is not available")
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    return accounts
  } catch (error) {
    console.error("Error requesting accounts:", error)
    throw error
  }
}

// Get the current account
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetaMaskAvailable()) {
    return null
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    return accounts.length > 0 ? accounts[0] : null
  } catch (error) {
    console.error("Error getting current account:", error)
    return null
  }
}

// Get the balance of an account
export const getBalance = async (address: string): Promise<string> => {
  if (!isMetaMaskAvailable()) {
    throw new Error("MetaMask is not available")
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const balance = await provider.getBalance(address)
  return ethers.utils.formatEther(balance)
}

// Switch to a supported network
export const switchToSupportedNetwork = async (): Promise<boolean> => {
  if (!isMetaMaskAvailable()) {
    throw new Error("MetaMask is not available")
  }

  try {
    // Try to switch to Sepolia
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia chainId in hex
    })
    return true
  } catch (switchError: any) {
    // If the network is not added to MetaMask, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7", // Sepolia chainId in hex
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        })
        return true
      } catch (addError) {
        console.error("Error adding Sepolia network:", addError)
        return false
      }
    }
    console.error("Error switching network:", switchError)
    return false
  }
}
