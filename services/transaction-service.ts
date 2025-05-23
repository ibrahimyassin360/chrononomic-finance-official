import { ethers } from "ethers"
import { getContracts } from "./contract-service"
import { CONTRACT_ADDRESSES } from "@/config/contracts"

// Types
export type TransactionState = {
  status: "pending" | "mining" | "success" | "failed"
  hash?: string
  error?: string
  confirmation?: number
}

export type TransactionOptions = {
  gasLimit?: string
  speed?: "slow" | "standard" | "fast" | "rapid"
  onStatus?: (status: TransactionState) => void
}

// Helper function to get gas price based on speed
const getGasPrice = async (
  provider: ethers.providers.Web3Provider,
  speed: "slow" | "standard" | "fast" | "rapid" = "standard",
): Promise<ethers.BigNumber> => {
  const baseGasPrice = await provider.getGasPrice()

  // Adjust gas price based on speed
  switch (speed) {
    case "slow":
      return baseGasPrice.mul(80).div(100) // 80% of base gas price
    case "standard":
      return baseGasPrice // 100% of base gas price
    case "fast":
      return baseGasPrice.mul(120).div(100) // 120% of base gas price
    case "rapid":
      return baseGasPrice.mul(150).div(100) // 150% of base gas price
    default:
      return baseGasPrice
  }
}

// Helper function to handle transaction status updates
const handleTransaction = async (
  tx: ethers.ContractTransaction,
  onStatus?: (status: TransactionState) => void,
): Promise<TransactionState> => {
  // Update status to mining
  onStatus?.({
    status: "mining",
    hash: tx.hash,
  })

  try {
    // Wait for transaction to be mined
    const receipt = await tx.wait()

    // Update status to success
    const result: TransactionState = {
      status: "success",
      hash: receipt.transactionHash,
      confirmation: receipt.confirmations,
    }

    onStatus?.(result)
    return result
  } catch (error: any) {
    // Update status to failed
    const result: TransactionState = {
      status: "failed",
      hash: tx.hash,
      error: error.message || "Transaction failed",
    }

    onStatus?.(result)
    return result
  }
}

// Get Chronon balance
export const getChrononBalance = async (
  address: string,
  provider: ethers.providers.Web3Provider,
  chainId: number,
): Promise<string> => {
  try {
    // Get addresses for the current network
    const addresses = CONTRACT_ADDRESSES[chainId] || {}

    if (!addresses.ChrononToken) {
      throw new Error("Token contract address not found for this network")
    }

    // Get ABI from the contract JSON
    const ChrononTokenABI = (await import("@/contracts/ChrononToken.json")).default

    // Create contract instance with provider (read-only)
    const tokenContract = new ethers.Contract(addresses.ChrononToken, ChrononTokenABI.abi, provider)

    // Get balance
    const balance = await tokenContract.balanceOf(address)
    return ethers.utils.formatUnits(balance, 18)
  } catch (error) {
    console.error("Error getting Chronon balance:", error)
    throw error
  }
}

// Buy Chronons
export const buyChronons = async (
  ethAmount: string,
  signer: ethers.Signer,
  chainId: number,
  options?: TransactionOptions,
): Promise<TransactionState> => {
  try {
    const { chrononomicFinance } = getContracts(signer, chainId)
    const provider = signer.provider as ethers.providers.Web3Provider

    // Update status to pending
    options?.onStatus?.({
      status: "pending",
    })

    // Get gas price based on speed
    const gasPrice = options?.speed ? await getGasPrice(provider, options.speed) : undefined

    // Buy Chronons by sending ETH
    const tx = await chrononomicFinance.buyChronons({
      value: ethers.utils.parseEther(ethAmount),
      gasLimit: options?.gasLimit ? ethers.BigNumber.from(options.gasLimit) : undefined,
      gasPrice,
    })

    // Handle transaction status
    return await handleTransaction(tx, options?.onStatus)
  } catch (error: any) {
    console.error("Error buying Chronons:", error)

    // Update status to failed
    const result: TransactionState = {
      status: "failed",
      error: error.message || "Failed to buy Chronons",
    }

    options?.onStatus?.(result)
    return result
  }
}

// Sell Chronons
export const sellChronons = async (
  amount: string,
  signer: ethers.Signer,
  chainId: number,
  options?: TransactionOptions,
): Promise<TransactionState> => {
  try {
    const { chrononToken, chrononomicFinance } = getContracts(signer, chainId)
    const provider = signer.provider as ethers.providers.Web3Provider

    // Update status to pending
    options?.onStatus?.({
      status: "pending",
    })

    // Get gas price based on speed
    const gasPrice = options?.speed ? await getGasPrice(provider, options.speed) : undefined

    // Convert amount to wei
    const amountInWei = ethers.utils.parseUnits(amount, 18)

    // First approve the finance contract to spend tokens
    const approveTx = await chrononToken.approve(chrononomicFinance.address, amountInWei, {
      gasLimit: options?.gasLimit ? ethers.BigNumber.from(options.gasLimit) : undefined,
      gasPrice,
    })
    await approveTx.wait()

    // Then sell the tokens
    const tx = await chrononomicFinance.sellChronons(amountInWei, {
      gasLimit: options?.gasLimit ? ethers.BigNumber.from(options.gasLimit) : undefined,
      gasPrice,
    })

    // Handle transaction status
    return await handleTransaction(tx, options?.onStatus)
  } catch (error: any) {
    console.error("Error selling Chronons:", error)

    // Update status to failed
    const result: TransactionState = {
      status: "failed",
      error: error.message || "Failed to sell Chronons",
    }

    options?.onStatus?.(result)
    return result
  }
}

// Get user bonds
export const getUserBonds = async (address: string, signer: ethers.Signer, chainId: number): Promise<any[]> => {
  try {
    const { chrononBond } = getContracts(signer, chainId)

    // Get next bond ID to know how many bonds to check
    const nextBondId = await chrononBond.nextBondId()
    const bonds = []

    // Loop through all bonds and find those owned by the user
    for (let i = 1; i < nextBondId.toNumber(); i++) {
      const bond = await chrononBond.bonds(i)

      if (bond.owner.toLowerCase() === address.toLowerCase()) {
        bonds.push({
          id: i,
          owner: bond.owner,
          amount: ethers.utils.formatUnits(bond.amount, 18),
          maturity: new Date(bond.maturity.toNumber() * 1000),
          redeemed: bond.redeemed,
        })
      }
    }

    return bonds
  } catch (error) {
    console.error("Error getting user bonds:", error)
    throw error
  }
}

// Issue bond
export const issueBond = async (
  amount: string,
  duration: number,
  signer: ethers.Signer,
  chainId: number,
  options?: TransactionOptions,
): Promise<TransactionState> => {
  try {
    const { chrononToken, chrononBond } = getContracts(signer, chainId)
    const provider = signer.provider as ethers.providers.Web3Provider

    // Update status to pending
    options?.onStatus?.({
      status: "pending",
    })

    // Get gas price based on speed
    const gasPrice = options?.speed ? await getGasPrice(provider, options.speed) : undefined

    // Convert amount to wei
    const amountInWei = ethers.utils.parseUnits(amount, 18)

    // First approve the bond contract to spend tokens
    const approveTx = await chrononToken.approve(chrononBond.address, amountInWei, {
      gasLimit: options?.gasLimit ? ethers.BigNumber.from(options.gasLimit) : undefined,
      gasPrice,
    })
    await approveTx.wait()

    // Then issue the bond
    const tx = await chrononBond.issueBond(amountInWei, duration, {
      gasLimit: options?.gasLimit ? ethers.BigNumber.from(options.gasLimit) : undefined,
      gasPrice,
    })

    // Handle transaction status
    return await handleTransaction(tx, options?.onStatus)
  } catch (error: any) {
    console.error("Error issuing bond:", error)

    // Update status to failed
    const result: TransactionState = {
      status: "failed",
      error: error.message || "Failed to issue bond",
    }

    options?.onStatus?.(result)
    return result
  }
}

// Redeem bond
export const redeemBond = async (
  bondId: number,
  signer: ethers.Signer,
  chainId: number,
  options?: TransactionOptions,
): Promise<TransactionState> => {
  try {
    const { chrononBond } = getContracts(signer, chainId)
    const provider = signer.provider as ethers.providers.Web3Provider

    // Update status to pending
    options?.onStatus?.({
      status: "pending",
    })

    // Get gas price based on speed
    const gasPrice = options?.speed ? await getGasPrice(provider, options.speed) : undefined

    // Redeem the bond
    const tx = await chrononBond.redeemBond(bondId, {
      gasLimit: options?.gasLimit ? ethers.BigNumber.from(options.gasLimit) : undefined,
      gasPrice,
    })

    // Handle transaction status
    return await handleTransaction(tx, options?.onStatus)
  } catch (error: any) {
    console.error("Error redeeming bond:", error)

    // Update status to failed
    const result: TransactionState = {
      status: "failed",
      error: error.message || "Failed to redeem bond",
    }

    options?.onStatus?.(result)
    return result
  }
}

// Get Chronon prices
export const getChrononPrices = async (
  provider: ethers.providers.Web3Provider,
  chainId: number,
): Promise<{ buyPrice: string; sellPrice: string }> => {
  try {
    // Get addresses for the current network
    const addresses = CONTRACT_ADDRESSES[chainId] || {}

    if (!addresses.ChrononomicFinance) {
      throw new Error("Finance contract address not found for this network")
    }

    // Get ABI from the contract JSON
    const ChrononomicFinanceABI = (await import("@/contracts/ChrononomicFinance.json")).default

    // Create contract instance with provider (read-only)
    const financeContract = new ethers.Contract(addresses.ChrononomicFinance, ChrononomicFinanceABI.abi, provider)

    // Get prices
    const buyPrice = await financeContract.buyPrice()
    const sellPrice = await financeContract.sellPrice()

    return {
      buyPrice: ethers.utils.formatUnits(buyPrice, 18),
      sellPrice: ethers.utils.formatUnits(sellPrice, 18),
    }
  } catch (error) {
    console.error("Error getting Chronon prices:", error)
    throw error
  }
}
