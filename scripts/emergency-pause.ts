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
    throw new Error("Insufficient balance. At least 0.1 ETH recommended for emergency operations.")
  }

  const { ChrononomicFinance } = deploymentInfo.contracts

  console.log("\n🚨 EMERGENCY PAUSE OPERATION 🚨")
  console.log("This will pause all contract operations.")

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  await new Promise((resolve) => {
    readline.question("Type 'EMERGENCY PAUSE' to confirm: ", (answer: string) => {
      readline.close()
      if (answer !== "EMERGENCY PAUSE") {
        console.log("Operation cancelled.")
        process.exit(0)
      }
      console.log("Proceeding with emergency pause...\n")
      resolve(null)
    })
  })

  // Connect to ChrononomicFinance contract
  const chrononomicFinance = new ethers.Contract(ChrononomicFinance, ChrononomicFinanceABI.abi, wallet)

  // Check if the contract is already paused
  const isPaused = await chrononomicFinance.paused()
  if (isPaused) {
    console.log("⚠️ Contract is already paused.")
    process.exit(0)
  }

  // Get current gas price
  const gasPrice = await provider.getGasPrice()
  console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`)

  // Pause the contract
  console.log("Pausing ChrononomicFinance contract...")
  const pauseTx = await chrononomicFinance.pause({ gasPrice })

  console.log(`Transaction hash: ${pauseTx.hash}`)
  console.log("Waiting for transaction confirmation...")

  await pauseTx.wait()
  console.log("✅ ChrononomicFinance contract has been paused")

  // Verify the contract is paused
  const isPausedAfter = await chrononomicFinance.paused()
  if (isPausedAfter) {
    console.log("✅ Verified: Contract is now paused")
  } else {
    console.log("❌ Error: Contract is still not paused")
  }

  console.log("\n⚠️ IMPORTANT NEXT STEPS:")
  console.log("1. Notify the team about the emergency pause")
  console.log("2. Communicate with users about the situation")
  console.log("3. Investigate the issue that required the pause")
  console.log("4. Develop and test a fix")
  console.log("5. Deploy the fix and unpause the contract when safe")
}

// Execute the emergency pause
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Emergency pause failed:")
    console.error(error)
    process.exit(1)
  })
