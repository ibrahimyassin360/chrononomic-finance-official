import { ethers } from "ethers"

// Types
export type GasEstimation = {
  gasLimit: string
  gasPrice: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  estimatedCostEth: string
  estimatedCostUsd: string
}

// Get current ETH price in USD
const getEthPrice = async (): Promise<number> => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
    const data = await response.json()
    return data.ethereum.usd
  } catch (error) {
    console.error("Error fetching ETH price:", error)
    return 2000 // Fallback price
  }
}

// Get gas price based on speed
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

// Calculate gas cost
const calculateGasCost = async (
  gasLimit: ethers.BigNumber,
  gasPrice: ethers.BigNumber,
): Promise<{ costEth: string; costUsd: string }> => {
  const gasCostWei = gasLimit.mul(gasPrice)
  const gasCostEth = ethers.utils.formatEther(gasCostWei)

  // Get ETH price in USD
  const ethPrice = await getEthPrice()
  const gasCostUsd = (Number.parseFloat(gasCostEth) * ethPrice).toFixed(2)

  return {
    costEth: gasCostEth,
    costUsd: gasCostUsd,
  }
}

// Estimate gas for buying Chronons
export const estimateBuyChrononsGas = async (
  ethAmount: string,
  speed: "slow" | "standard" | "fast" | "rapid" = "standard",
): Promise<GasEstimation> => {
  try {
    // Check if window.ethereum is available
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("Ethereum provider not available")
    }

    // Create provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    // Get chain ID
    const network = await provider.getNetwork()
    const chainId = network.chainId

    // Get contract addresses
    const { CONTRACT_ADDRESSES } = await import("@/config/contracts")
    const addresses = CONTRACT_ADDRESSES[chainId] || {}

    if (!addresses.ChrononomicFinance) {
      throw new Error("Finance contract address not found for this network")
    }

    // Get ABI from the contract JSON
    const ChrononomicFinanceABI = (await import("@/contracts/ChrononomicFinance.json")).default

    // Create contract instance
    const financeContract = new ethers.Contract(addresses.ChrononomicFinance, ChrononomicFinanceABI.abi, signer)

    // Estimate gas
    const gasLimit = await financeContract.estimateGas.buyChronons({
      value: ethers.utils.parseEther(ethAmount),
    })

    // Add 20% buffer to gas limit
    const gasLimitWithBuffer = gasLimit.mul(120).div(100)

    // Get gas price based on speed
    const gasPrice = await getGasPrice(provider, speed)

    // Calculate gas cost
    const { costEth, costUsd } = await calculateGasCost(gasLimitWithBuffer, gasPrice)

    return {
      gasLimit: gasLimitWithBuffer.toString(),
      gasPrice: gasPrice.toString(),
      estimatedCostEth: costEth,
      estimatedCostUsd: costUsd,
    }
  } catch (error: any) {
    console.error("Error estimating buy gas:", error)
    throw error
  }
}

// Estimate gas for selling Chronons
export const estimateSellChrononsGas = async (
  amount: string,
  speed: "slow" | "standard" | "fast" | "rapid" = "standard",
): Promise<GasEstimation> => {
  try {
    // Check if window.ethereum is available
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("Ethereum provider not available")
    }

    // Create provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    // Get chain ID
    const network = await provider.getNetwork()
    const chainId = network.chainId

    // Get contract addresses
    const { CONTRACT_ADDRESSES } = await import("@/config/contracts")
    const addresses = CONTRACT_ADDRESSES[chainId] || {}

    if (!addresses.ChrononomicFinance || !addresses.ChrononToken) {
      throw new Error("Contract addresses not found for this network")
    }

    // Get ABIs from the contract JSONs
    const ChrononomicFinanceABI = (await import("@/contracts/ChrononomicFinance.json")).default
    const ChrononTokenABI = (await import("@/contracts/ChrononToken.json")).default

    // Create contract instances
    const financeContract = new ethers.Contract(addresses.ChrononomicFinance, ChrononomicFinanceABI.abi, signer)
    const tokenContract = new ethers.Contract(addresses.ChrononToken, ChrononTokenABI.abi, signer)

    // Convert amount to wei
    const amountInWei = ethers.utils.parseUnits(amount, 18)

    // Estimate gas for approve
    const approveGasLimit = await tokenContract.estimateGas.approve(addresses.ChrononomicFinance, amountInWei)

    // Estimate gas for sell
    const sellGasLimit = await financeContract.estimateGas.sellChronons(amountInWei)

    // Add 20% buffer to gas limits
    const approveGasLimitWithBuffer = approveGasLimit.mul(120).div(100)
    const sellGasLimitWithBuffer = sellGasLimit.mul(120).div(100)

    // Total gas limit
    const totalGasLimit = approveGasLimitWithBuffer.add(sellGasLimitWithBuffer)

    // Get gas price based on speed
    const gasPrice = await getGasPrice(provider, speed)

    // Calculate gas cost
    const { costEth, costUsd } = await calculateGasCost(totalGasLimit, gasPrice)

    return {
      gasLimit: totalGasLimit.toString(),
      gasPrice: gasPrice.toString(),
      estimatedCostEth: costEth,
      estimatedCostUsd: costUsd,
    }
  } catch (error: any) {
    console.error("Error estimating sell gas:", error)
    throw error
  }
}

// Estimate gas for issuing a bond
export const estimateIssueBondGas = async (
  amount: string,
  duration: number,
  speed: "slow" | "standard" | "fast" | "rapid" = "standard",
): Promise<GasEstimation> => {
  try {
    // Check if window.ethereum is available
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("Ethereum provider not available")
    }

    // Create provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    // Get chain ID
    const network = await provider.getNetwork()
    const chainId = network.chainId

    // Get contract addresses
    const { CONTRACT_ADDRESSES } = await import("@/config/contracts")
    const addresses = CONTRACT_ADDRESSES[chainId] || {}

    if (!addresses.ChrononBond || !addresses.ChrononToken) {
      throw new Error("Contract addresses not found for this network")
    }

    // Get ABIs from the contract JSONs
    const ChrononBondABI = (await import("@/contracts/ChrononBond.json")).default
    const ChrononTokenABI = (await import("@/contracts/ChrononToken.json")).default

    // Create contract instances
    const bondContract = new ethers.Contract(addresses.ChrononBond, ChrononBondABI.abi, signer)
    const tokenContract = new ethers.Contract(addresses.ChrononToken, ChrononTokenABI.abi, signer)

    // Convert amount to wei
    const amountInWei = ethers.utils.parseUnits(amount, 18)

    // Estimate gas for approve
    const approveGasLimit = await tokenContract.estimateGas.approve(addresses.ChrononBond, amountInWei)

    // Estimate gas for issue bond
    const issueBondGasLimit = await bondContract.estimateGas.issueBond(amountInWei, duration)

    // Add 20% buffer to gas limits
    const approveGasLimitWithBuffer = approveGasLimit.mul(120).div(100)
    const issueBondGasLimitWithBuffer = issueBondGasLimit.mul(120).div(100)

    // Total gas limit
    const totalGasLimit = approveGasLimitWithBuffer.add(issueBondGasLimitWithBuffer)

    // Get gas price based on speed
    const gasPrice = await getGasPrice(provider, speed)

    // Calculate gas cost
    const { costEth, costUsd } = await calculateGasCost(totalGasLimit, gasPrice)

    return {
      gasLimit: totalGasLimit.toString(),
      gasPrice: gasPrice.toString(),
      estimatedCostEth: costEth,
      estimatedCostUsd: costUsd,
    }
  } catch (error: any) {
    console.error("Error estimating issue bond gas:", error)
    throw error
  }
}
