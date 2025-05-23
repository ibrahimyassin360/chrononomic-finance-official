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
  if (!process.env.MAINNET_RPC_URL) {
    throw new Error("Missing MAINNET_RPC_URL environment variable")
  }

  // Get the latest deployment file
  const deploymentsDir = path.join(__dirname, "../deployments")
  if (!fs.existsSync(deploymentsDir)) {
    throw new Error("No deployments directory found")
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
    throw new Error("No deployment files found")
  }

  // Read the latest deployment file
  const deploymentInfo = JSON.parse(fs.readFileSync(path.join(deploymentsDir, deploymentFiles[0]), "utf8"))

  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL)

  // Get network information
  const network = await provider.getNetwork()
  console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`)

  // Check if we're on the same network as the deployment
  if (network.chainId !== deploymentInfo.network.chainId) {
    throw new Error(
      `Network mismatch: Deployment is on ${deploymentInfo.network.name} (chainId: ${deploymentInfo.network.chainId}), but you're connected to ${network.name} (chainId: ${network.chainId})`,
    )
  }

  const { ChrononToken, ChrononBond, ChrononVault, ChrononomicFinance } = deploymentInfo.contracts

  console.log("\n👀 Monitoring contract events...")
  console.log("Press Ctrl+C to stop monitoring")

  // Connect to contracts
  const chrononToken = new ethers.Contract(ChrononToken, ChrononTokenABI.abi, provider)
  const chrononBond = new ethers.Contract(ChrononBond, ChrononBondABI.abi, provider)
  const chrononVault = new ethers.Contract(ChrononVault, ChrononVaultABI.abi, provider)
  const chrononomicFinance = new ethers.Contract(ChrononomicFinance, ChrononomicFinanceABI.abi, provider)

  // Monitor ChrononToken events
  console.log("\n📡 Monitoring ChrononToken events...")

  chrononToken.on("Transfer", (from, to, value, event) => {
    console.log(`\n🔄 Token Transfer at block ${event.blockNumber}`)
    console.log(`From: ${from}`)
    console.log(`To: ${to}`)
    console.log(`Value: ${ethers.utils.formatEther(value)}`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  chrononToken.on("Approval", (owner, spender, value, event) => {
    console.log(`\n✅ Token Approval at block ${event.blockNumber}`)
    console.log(`Owner: ${owner}`)
    console.log(`Spender: ${spender}`)
    console.log(`Value: ${ethers.utils.formatEther(value)}`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  // Monitor ChrononBond events
  console.log("\n📡 Monitoring ChrononBond events...")

  chrononBond.on("BondCreated", (owner, bondId, amount, maturityTime, interestRate, event) => {
    console.log(`\n📝 Bond Created at block ${event.blockNumber}`)
    console.log(`Owner: ${owner}`)
    console.log(`Bond ID: ${bondId.toString()}`)
    console.log(`Amount: ${ethers.utils.formatEther(amount)}`)
    console.log(`Maturity Time: ${new Date(maturityTime.toNumber() * 1000).toISOString()}`)
    console.log(`Interest Rate: ${interestRate.toNumber() / 100}%`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  chrononBond.on("BondRedeemed", (owner, bondId, amount, interest, event) => {
    console.log(`\n💰 Bond Redeemed at block ${event.blockNumber}`)
    console.log(`Owner: ${owner}`)
    console.log(`Bond ID: ${bondId.toString()}`)
    console.log(`Amount: ${ethers.utils.formatEther(amount)}`)
    console.log(`Interest: ${ethers.utils.formatEther(interest)}`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  // Monitor ChrononVault events
  console.log("\n📡 Monitoring ChrononVault events...")

  chrononVault.on("Deposit", (user, amount, event) => {
    console.log(`\n📥 Vault Deposit at block ${event.blockNumber}`)
    console.log(`User: ${user}`)
    console.log(`Amount: ${ethers.utils.formatEther(amount)}`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  chrononVault.on("Withdrawal", (user, amount, event) => {
    console.log(`\n📤 Vault Withdrawal at block ${event.blockNumber}`)
    console.log(`User: ${user}`)
    console.log(`Amount: ${ethers.utils.formatEther(amount)}`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  // Monitor ChrononomicFinance events
  console.log("\n📡 Monitoring ChrononomicFinance events...")

  chrononomicFinance.on("TokensPurchased", (buyer, ethAmount, tokenAmount, event) => {
    console.log(`\n🛒 Tokens Purchased at block ${event.blockNumber}`)
    console.log(`Buyer: ${buyer}`)
    console.log(`ETH Amount: ${ethers.utils.formatEther(ethAmount)}`)
    console.log(`Token Amount: ${ethers.utils.formatEther(tokenAmount)}`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  chrononomicFinance.on("TokensSold", (seller, tokenAmount, ethAmount, event) => {
    console.log(`\n💱 Tokens Sold at block ${event.blockNumber}`)
    console.log(`Seller: ${seller}`)
    console.log(`Token Amount: ${ethers.utils.formatEther(tokenAmount)}`)
    console.log(`ETH Amount: ${ethers.utils.formatEther(ethAmount)}`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  chrononomicFinance.on("PriceUpdated", (newBuyPrice, newSellPrice, event) => {
    console.log(`\n💲 Price Updated at block ${event.blockNumber}`)
    console.log(`New Buy Price: ${ethers.utils.formatEther(newBuyPrice)} ETH per token`)
    console.log(`New Sell Price: ${ethers.utils.formatEther(newSellPrice)} ETH per token`)
    console.log(`Transaction: ${event.transactionHash}`)
  })

  console.log("\n✅ Event listeners set up successfully")
  console.log("Waiting for events...")

  // Keep the script running
  await new Promise(() => {})
}

// Execute the monitoring
main().catch((error) => {
  console.error("\n❌ Monitoring failed:")
  console.error(error)
  process.exit(1)
})
