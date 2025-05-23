import { ethers } from "ethers"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Contract ABIs
import ChrononTokenABI from "../contracts/ChrononToken.json"
import ChrononBondABI from "../contracts/ChrononBond.json"
import ChrononomicFinanceABI from "../contracts/ChrononomicFinance.json"

// Replace these with your deployed contract addresses
const CONTRACT_ADDRESSES = {
  ChrononToken: "0x1234567890123456789012345678901234567890",
  ChrononBond: "0x2345678901234567890123456789012345678901",
  ChrononomicFinance: "0x4567890123456789012345678901234567890123",
}

async function main() {
  // Check if private key is available
  if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY environment variable")
  }

  // Check if RPC URL is available
  if (!process.env.ETHEREUM_RPC_URL) {
    throw new Error("Missing ETHEREUM_RPC_URL environment variable")
  }

  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  console.log(`Testing contracts with account: ${wallet.address}`)

  // Get contract instances
  const chrononToken = new ethers.Contract(CONTRACT_ADDRESSES.ChrononToken, ChrononTokenABI.abi, wallet)
  const chrononBond = new ethers.Contract(CONTRACT_ADDRESSES.ChrononBond, ChrononBondABI.abi, wallet)
  const chrononomicFinance = new ethers.Contract(
    CONTRACT_ADDRESSES.ChrononomicFinance,
    ChrononomicFinanceABI.abi,
    wallet,
  )

  // Test 1: Check token balance
  console.log("\nTest 1: Checking token balance...")
  const balance = await chrononToken.balanceOf(wallet.address)
  console.log(`Token balance: ${ethers.utils.formatUnits(balance, 18)} CHRN`)

  // Test 2: Buy Chronons
  console.log("\nTest 2: Buying Chronons...")
  const buyAmount = ethers.utils.parseEther("0.1") // 0.1 ETH
  const buyTx = await chrononomicFinance.buyChronons({ value: buyAmount })
  console.log(`Transaction hash: ${buyTx.hash}`)
  await buyTx.wait()
  console.log("Buy transaction confirmed")

  // Check updated balance
  const newBalance = await chrononToken.balanceOf(wallet.address)
  console.log(`New token balance: ${ethers.utils.formatUnits(newBalance, 18)} CHRN`)

  // Test 3: Create a bond
  console.log("\nTest 3: Creating a bond...")
  // First approve the bond contract to spend tokens
  const bondAmount = ethers.utils.parseEther("100") // 100 CHRN
  const approveTx = await chrononToken.approve(chrononBond.address, bondAmount)
  await approveTx.wait()
  console.log("Approval transaction confirmed")

  // Then create the bond
  const duration = 30 * 24 * 60 * 60 // 30 days in seconds
  const bondTx = await chrononBond.issueBond(bondAmount, duration)
  console.log(`Transaction hash: ${bondTx.hash}`)
  await bondTx.wait()
  console.log("Bond creation transaction confirmed")

  // Test 4: Get bond details
  console.log("\nTest 4: Getting bond details...")
  const bondId = 1 // Assuming this is the first bond
  const bond = await chrononBond.bonds(bondId)
  console.log(`Bond owner: ${bond.owner}`)
  console.log(`Bond amount: ${ethers.utils.formatUnits(bond.amount, 18)} CHRN`)
  console.log(`Bond maturity: ${new Date(bond.maturity.toNumber() * 1000)}`)
  console.log(`Bond redeemed: ${bond.redeemed}`)

  console.log("\nAll tests completed successfully!")
}

// Execute the tests
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
