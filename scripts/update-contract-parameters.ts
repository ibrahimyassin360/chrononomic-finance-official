import { ethers } from "ethers"
import * as dotenv from "dotenv"
import fs from "fs"
import path from "path"

// Load environment variables
dotenv.config()

// Contract ABIs
import ChrononomicFinanceABI from "../contracts/ChrononomicFinance.json"

async function main() {
  // Check if private key is available
  if (!process.env.MAINNET_PRIVATE_KEY) {
    throw new Error("Missing MAINNET_PRIVATE_KEY environment variable")
  }

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
  const wallet = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY, provider)

  // Get network information
  const network = await provider.getNetwork()
  console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`)

  // Check if we're on the same network as the deployment
  if (network.chainId !== deploymentInfo.network.chainId) {
    throw new Error(
      `Network mismatch: Deployment is on ${deploymentInfo.network.name} (chainId: ${deploymentInfo.network.chainId}), but you're connected to ${network.name} (chainId: ${network.chainId})`,
    )
  }

  console.log(`Using account: ${wallet.address}`)

  // Get the current balance
  const balance = await wallet.getBalance()
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`)

  // Check if balance is sufficient
  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    throw new Error("Insufficient balance. At least 0.1 ETH recommended for parameter updates.")
  }

  const { ChrononomicFinance } = deploymentInfo.contracts

  // Connect to ChrononomicFinance contract
  const chrononomicFinance = new ethers.Contract(ChrononomicFinance, ChrononomicFinanceABI.abi, wallet)

  // Get current parameters
  const currentBuyPrice = await chrononomicFinance.buyPrice()
  const currentSellPrice = await chrononomicFinance.sellPrice()

  console.log("\n📊 Current Parameters:")
  console.log(`Buy Price: ${ethers.utils.formatEther(currentBuyPrice)} ETH per token`)
  console.log(`Sell Price: ${ethers.utils.formatEther(currentSellPrice)} ETH per token`)

  // New parameters
  const newBuyPrice = ethers.utils.parseEther("0.00105") // 0.00105 ETH per token
  const newSellPrice = ethers.utils.parseEther("0.00095") // 0.00095 ETH per token

  console.log("\n📝 New Parameters:")
  console.log(`Buy Price: ${ethers.utils.formatEther(newBuyPrice)} ETH per token`)
  console.log(`Sell Price: ${ethers.utils.formatEther(newSellPrice)} ETH per token`)

  // Confirm update
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  await new Promise((resolve) => {
    readline.question("Do you want to update the parameters? (yes/no): ", (answer: string) => {
      readline.close()
      if (answer.toLowerCase() !== "yes") {
        console.log("Update cancelled.")
        process.exit(0)
      }
      console.log("Proceeding with parameter update...\n")
      resolve(null)
    })
  })

  // Get current gas price
  const gasPrice = await provider.getGasPrice()
  console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`)

  // Update parameters
  console.log("Updating parameters...")
  const updateTx = await chrononomicFinance.updatePrices(newBuyPrice, newSellPrice, { gasPrice })

  console.log(`Transaction hash: ${updateTx.hash}`)
  console.log("Waiting for transaction confirmation...")

  await updateTx.wait()
  console.log("✅ Parameters updated successfully")

  // Verify the new parameters
  const updatedBuyPrice = await chrononomicFinance.buyPrice()
  const updatedSellPrice = await chrononomicFinance.sellPrice()

  console.log("\n📊 Updated Parameters:")
  console.log(`Buy Price: ${ethers.utils.formatEther(updatedBuyPrice)} ETH per token`)
  console.log(`Sell Price: ${ethers.utils.formatEther(updatedSellPrice)} ETH per token`)

  console.log("\n✅ Parameter update completed successfully!")
}

// Execute the update
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Parameter update failed:")
    console.error(error)
    process.exit(1)
  })
