import { ethers } from "ethers"
import * as dotenv from "dotenv"
import fs from "fs"
import path from "path"

// Load environment variables
dotenv.config()

// Contract ABIs
import ChrononTokenABI from "../contracts/ChrononToken.json"
import ChrononBondABI from "../contracts/ChrononBond.json"
import ChrononVaultABI from "../contracts/ChrononVault.json"
import ChrononomicFinanceABI from "../contracts/ChrononomicFinance.json"

async function main() {
  // Check if RPC URL is available
  if (!process.env.ETHEREUM_RPC_URL) {
    throw new Error("Missing ETHEREUM_RPC_URL environment variable")
  }

  // Check if private key is available
  if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY environment variable")
  }

  // Get the latest deployment file
  const deploymentsDir = path.join(__dirname, "../deployments")
  if (!fs.existsSync(deploymentsDir)) {
    throw new Error("No deployments directory found. Run deployment script first.")
  }

  const deploymentFiles = fs
    .readdirSync(deploymentsDir)
    .filter((file) => file.startsWith("deployment-") && file.endsWith(".json"))
    .sort((a, b) => {
      // Sort by date in filename (deployment-network-YYYY-MM-DD.json)
      const dateA = a.split("-").slice(2).join("-").replace(".json", "")
      const dateB = b.split("-").slice(2).join("-").replace(".json", "")
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

  if (deploymentFiles.length === 0) {
    throw new Error("No deployment files found. Run deployment script first.")
  }

  // Read the latest deployment file
  const latestDeployment = JSON.parse(fs.readFileSync(path.join(deploymentsDir, deploymentFiles[0]), "utf8"))

  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  // Get network information
  const network = await provider.getNetwork()
  console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`)
  console.log(`Using account: ${wallet.address}`)

  // Get contract addresses
  const {
    ChrononToken: tokenAddress,
    ChrononBond: bondAddress,
    ChrononVault: vaultAddress,
    ChrononomicFinance: financeAddress,
  } = latestDeployment.contracts

  // Connect to contracts
  const token = new ethers.Contract(tokenAddress, ChrononTokenABI.abi, wallet)
  const bond = new ethers.Contract(bondAddress, ChrononBondABI.abi, wallet)
  const vault = new ethers.Contract(vaultAddress, ChrononVaultABI.abi, wallet)
  const finance = new ethers.Contract(financeAddress, ChrononomicFinanceABI.abi, wallet)

  console.log("\n--- Testing Contracts ---")

  // Test ChrononToken
  console.log("\nTesting ChrononToken...")
  const name = await token.name()
  const symbol = await token.symbol()
  const totalSupply = await token.totalSupply()
  const balance = await token.balanceOf(wallet.address)

  console.log(`Token Name: ${name}`)
  console.log(`Token Symbol: ${symbol}`)
  console.log(`Total Supply: ${ethers.utils.formatEther(totalSupply)} ${symbol}`)
  console.log(`Your Balance: ${ethers.utils.formatEther(balance)} ${symbol}`)

  // Test ChrononomicFinance
  console.log("\nTesting ChrononomicFinance...")
  const buyPrice = await finance.buyPrice()
  const sellPrice = await finance.sellPrice()

  console.log(`Buy Price: ${ethers.utils.formatEther(buyPrice)} ETH per Chronon`)
  console.log(`Sell Price: ${ethers.utils.formatEther(sellPrice)} ETH per Chronon`)

  // Test buying Chronons
  console.log("\nTesting buying Chronons...")
  try {
    const buyAmount = ethers.utils.parseEther("0.01") // Buy with 0.01 ETH
    const buyTx = await finance.buyChronons({ value: buyAmount })
    console.log(`Buy transaction sent: ${buyTx.hash}`)
    console.log("Waiting for confirmation...")
    await buyTx.wait()

    // Check new balance
    const newBalance = await token.balanceOf(wallet.address)
    console.log(`New Balance: ${ethers.utils.formatEther(newBalance)} ${symbol}`)
    console.log(`Bought ${ethers.utils.formatEther(newBalance.sub(balance))} ${symbol}`)
  } catch (error) {
    console.error("Error buying Chronons:", error.message)
  }

  // Test creating a bond
  console.log("\nTesting bond creation...")
  try {
    // Approve token transfer
    const bondAmount = ethers.utils.parseEther("10") // 10 Chronons
    const approveTx = await token.approve(bond.address, bondAmount)
    console.log(`Approve transaction sent: ${approveTx.hash}`)
    console.log("Waiting for confirmation...")
    await approveTx.wait()

    // Create bond
    const duration = 60 * 60 * 24 * 7 // 1 week in seconds
    const issueTx = await bond.issueBond(bondAmount, duration)
    console.log(`Bond issue transaction sent: ${issueTx.hash}`)
    console.log("Waiting for confirmation...")
    await issueTx.wait()

    // Get bond details
    const bondId = (await bond.nextBondId()) - 1
    const bondDetails = await bond.bonds(bondId)
    console.log(`Bond created with ID: ${bondId}`)
    console.log(`Bond Amount: ${ethers.utils.formatEther(bondDetails.amount)} ${symbol}`)
    console.log(`Bond Maturity: ${new Date(bondDetails.maturity.toNumber() * 1000).toLocaleString()}`)
  } catch (error) {
    console.error("Error creating bond:", error.message)
  }

  console.log("\nContract tests completed!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
