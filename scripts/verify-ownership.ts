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
  const { multisigAddress } = deploymentInfo.config

  console.log("\n🔍 Verifying contract ownership...")

  // Check ChrononToken ownership
  const chrononToken = new ethers.Contract(ChrononToken, ChrononTokenABI.abi, provider)
  const adminRole = await chrononToken.DEFAULT_ADMIN_ROLE()
  const hasAdminRole = await chrononToken.hasRole(adminRole, multisigAddress)

  console.log(
    `ChrononToken admin role: ${hasAdminRole ? "✅ Multisig has admin role" : "❌ Multisig does NOT have admin role"}`,
  )

  // Check if deployer still has admin role
  const deployerHasAdminRole = await chrononToken.hasRole(adminRole, deploymentInfo.deployer)
  console.log(
    `ChrononToken deployer admin role: ${!deployerHasAdminRole ? "✅ Deployer has renounced admin role" : "❌ Deployer still has admin role"}`,
  )

  // Check ChrononBond ownership
  const chrononBond = new ethers.Contract(ChrononBond, ChrononBondABI.abi, provider)
  const bondOwner = await chrononBond.owner()

  console.log(
    `ChrononBond owner: ${bondOwner === multisigAddress ? "✅ Multisig is owner" : "❌ Multisig is NOT owner"}`,
  )
  console.log(`Current owner: ${bondOwner}`)

  // Check ChrononVault ownership
  const chrononVault = new ethers.Contract(ChrononVault, ChrononVaultABI.abi, provider)
  const vaultOwner = await chrononVault.owner()

  console.log(
    `ChrononVault owner: ${vaultOwner === multisigAddress ? "✅ Multisig is owner" : "❌ Multisig is NOT owner"}`,
  )
  console.log(`Current owner: ${vaultOwner}`)

  // Check ChrononomicFinance ownership
  const chrononomicFinance = new ethers.Contract(ChrononomicFinance, ChrononomicFinanceABI.abi, provider)
  const financeOwner = await chrononomicFinance.owner()

  console.log(
    `ChrononomicFinance owner: ${financeOwner === multisigAddress ? "✅ Multisig is owner" : "❌ Multisig is NOT owner"}`,
  )
  console.log(`Current owner: ${financeOwner}`)

  // Check if ChrononomicFinance has minter role
  const minterRole = await chrononToken.MINTER_ROLE()
  const hasMinterRole = await chrononToken.hasRole(minterRole, ChrononomicFinance)

  console.log(
    `ChrononomicFinance minter role: ${hasMinterRole ? "✅ Has minter role" : "❌ Does NOT have minter role"}`,
  )

  // Summary
  console.log("\n📋 Ownership Verification Summary:")

  const allCorrect =
    hasAdminRole &&
    !deployerHasAdminRole &&
    bondOwner === multisigAddress &&
    vaultOwner === multisigAddress &&
    financeOwner === multisigAddress &&
    hasMinterRole

  if (allCorrect) {
    console.log("✅ All ownership and permissions are correctly set up")
  } else {
    console.log("❌ There are issues with ownership or permissions that need to be addressed")
  }
}

// Execute the verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Verification failed:")
    console.error(error)
    process.exit(1)
  })
