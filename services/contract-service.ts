import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "@/config/contracts"

// Import ABIs
import ChrononTokenABI from "@/contracts/ChrononToken.json"
import ChrononBondABI from "@/contracts/ChrononBond.json"
import ChrononomicFinanceABI from "@/contracts/ChrononomicFinance.json"

// Get contract instances
export const getContracts = (signer: ethers.Signer, chainId: number) => {
  // Get addresses for the current network
  const addresses = CONTRACT_ADDRESSES[chainId] || {}

  // Check if addresses exist
  if (!addresses.ChrononToken || !addresses.ChrononBond || !addresses.ChrononomicFinance) {
    throw new Error("Contract addresses not found for this network")
  }

  return {
    chrononToken: new ethers.Contract(addresses.ChrononToken, ChrononTokenABI.abi, signer),
    chrononBond: new ethers.Contract(addresses.ChrononBond, ChrononBondABI.abi, signer),
    chrononomicFinance: new ethers.Contract(addresses.ChrononomicFinance, ChrononomicFinanceABI.abi, signer),
  }
}

// Token functions
export const getTokenBalance = async (
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

    // Create contract instance with provider (read-only)
    const tokenContract = new ethers.Contract(addresses.ChrononToken, ChrononTokenABI.abi, provider)

    // Get balance
    const balance = await tokenContract.balanceOf(address)
    return ethers.utils.formatUnits(balance, 18)
  } catch (error) {
    console.error("Error getting token balance:", error)
    throw error
  }
}

// Bond functions
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

export const issueBond = async (
  amount: string,
  duration: number,
  signer: ethers.Signer,
  chainId: number,
): Promise<any> => {
  try {
    const { chrononToken, chrononBond } = getContracts(signer, chainId)

    // Convert amount to wei
    const amountInWei = ethers.utils.parseUnits(amount, 18)

    // First approve the bond contract to spend tokens
    const approveTx = await chrononToken.approve(chrononBond.address, amountInWei)
    await approveTx.wait()

    // Then issue the bond
    const tx = await chrononBond.issueBond(amountInWei, duration)
    const receipt = await tx.wait()

    // Find the BondIssued event
    const event = receipt.events?.find((e: any) => e.event === "BondIssued")

    if (event) {
      return {
        bondId: event.args.id.toString(),
        owner: event.args.owner,
        amount: ethers.utils.formatUnits(event.args.amount, 18),
        maturity: new Date(event.args.maturity.toNumber() * 1000),
      }
    }

    return null
  } catch (error) {
    console.error("Error issuing bond:", error)
    throw error
  }
}

export const redeemBond = async (bondId: number, signer: ethers.Signer, chainId: number): Promise<boolean> => {
  try {
    const { chrononBond } = getContracts(signer, chainId)

    // Redeem the bond
    const tx = await chrononBond.redeemBond(bondId)
    await tx.wait()

    return true
  } catch (error) {
    console.error("Error redeeming bond:", error)
    throw error
  }
}

// Finance functions
export const buyChronons = async (ethAmount: string, signer: ethers.Signer, chainId: number): Promise<boolean> => {
  try {
    const { chrononomicFinance } = getContracts(signer, chainId)

    // Buy Chronons by sending ETH
    const tx = await chrononomicFinance.buyChronons({
      value: ethers.utils.parseEther(ethAmount),
    })
    await tx.wait()

    return true
  } catch (error) {
    console.error("Error buying Chronons:", error)
    throw error
  }
}

export const sellChronons = async (amount: string, signer: ethers.Signer, chainId: number): Promise<boolean> => {
  try {
    const { chrononToken, chrononomicFinance } = getContracts(signer, chainId)

    // Convert amount to wei
    const amountInWei = ethers.utils.parseUnits(amount, 18)

    // First approve the finance contract to spend tokens
    const approveTx = await chrononToken.approve(chrononomicFinance.address, amountInWei)
    await approveTx.wait()

    // Then sell the tokens
    const tx = await chrononomicFinance.sellChronons(amountInWei)
    await tx.wait()

    return true
  } catch (error) {
    console.error("Error selling Chronons:", error)
    throw error
  }
}

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
