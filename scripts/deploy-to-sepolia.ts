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

// Bytecode - normally this would be imported from compiled contracts
// For this example, we're using placeholder strings
const TOKEN_BYTECODE = ChrononTokenABI.bytecode || "0x..." // Replace with actual bytecode
const BOND_BYTECODE = ChrononBondABI.bytecode || "0x..." // Replace with actual bytecode
const VAULT_BYTECODE = ChrononVaultABI.bytecode || "0x..." // Replace with actual bytecode
const FINANCE_BYTECODE = ChrononomicFinanceABI.bytecode || "0x..." // Replace with actual bytecode

async function main() {
  // Check if private key is available
  if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY environment variable")
  }

  // Check if RPC URL is available
  if (!process.env.ETHEREUM_RPC_URL) {
    throw new Error("Missing ETHEREUM_RPC_URL environment variable")
  }

  // Connect to the Sepolia network
  const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  // Get network information
  const network = await provider.getNetwork()
  console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`)

  console.log(`Deploying contracts with account: ${wallet.address}`)

  // Get the current balance
  const balance = await wallet.getBalance()
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`)

  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    console.warn("WARNING: Account balance is low. You may need more ETH for deployment.")
  }

  try {
    // Deploy ChrononToken
    console.log("Deploying ChrononToken...")
    const initialSupply = ethers.utils.parseEther("1000000") // 1 million tokens
    const ChrononTokenFactory = new ethers.ContractFactory(ChrononTokenABI.abi, TOKEN_BYTECODE, wallet)

    const chrononToken = await ChrononTokenFactory.deploy(initialSupply)
    console.log(`ChrononToken deployment transaction: ${chrononToken.deployTransaction.hash}`)
    console.log("Waiting for transaction confirmation...")
    await chrononToken.deployed()
    console.log(`ChrononToken deployed to: ${chrononToken.address}`)

    // Deploy ChrononBond
    console.log("Deploying ChrononBond...")
    const ChrononBondFactory = new ethers.ContractFactory(ChrononBondABI.abi, BOND_BYTECODE, wallet)

    const chrononBond = await ChrononBondFactory.deploy(chrononToken.address)
    console.log(`ChrononBond deployment transaction: ${chrononBond.deployTransaction.hash}`)
    console.log("Waiting for transaction confirmation...")
    await chrononBond.deployed()
    console.log(`ChrononBond deployed to: ${chrononBond.address}`)

    // Deploy ChrononVault
    console.log("Deploying ChrononVault...")
    const ChrononVaultFactory = new ethers.ContractFactory(ChrononVaultABI.abi, VAULT_BYTECODE, wallet)

    const chrononVault = await ChrononVaultFactory.deploy(chrononToken.address)
    console.log(`ChrononVault deployment transaction: ${chrononVault.deployTransaction.hash}`)
    console.log("Waiting for transaction confirmation...")
    await chrononVault.deployed()
    console.log(`ChrononVault deployed to: ${chrononVault.address}`)

    // Deploy ChrononomicFinance
    console.log("Deploying ChrononomicFinance...")
    const buyPrice = ethers.utils.parseEther("0.001") // 1 ETH = 1000 Chronons
    const sellPrice = ethers.utils.parseEther("0.0009") // Slightly lower sell price

    const ChrononomicFinanceFactory = new ethers.ContractFactory(ChrononomicFinanceABI.abi, FINANCE_BYTECODE, wallet)

    const chrononomicFinance = await ChrononomicFinanceFactory.deploy(
      chrononToken.address,
      chrononBond.address,
      chrononVault.address,
      buyPrice,
      sellPrice,
    )
    console.log(`ChrononomicFinance deployment transaction: ${chrononomicFinance.deployTransaction.hash}`)
    console.log("Waiting for transaction confirmation...")
    await chrononomicFinance.deployed()
    console.log(`ChrononomicFinance deployed to: ${chrononomicFinance.address}`)

    // Set up permissions if needed
    // For example, if your token has a minter role:
    // const minterRole = await chrononToken.MINTER_ROLE();
    // await chrononToken.grantRole(minterRole, chrononomicFinance.address);
    // console.log("Minter role granted to ChrononomicFinance");

    // Output all contract addresses
    console.log("\nDeployment complete! Contract addresses:")
    console.log(`ChrononToken: ${chrononToken.address}`)
    console.log(`ChrononBond: ${chrononBond.address}`)
    console.log(`ChrononVault: ${chrononVault.address}`)
    console.log(`ChrononomicFinance: ${chrononomicFinance.address}`)

    // Save to a file for easy reference
    const deploymentInfo = {
      network: {
        name: network.name,
        chainId: network.chainId,
      },
      contracts: {
        ChrononToken: chrononToken.address,
        ChrononBond: chrononBond.address,
        ChrononVault: chrononVault.address,
        ChrononomicFinance: chrononomicFinance.address,
      },
      deploymentTransactions: {
        ChrononToken: chrononToken.deployTransaction.hash,
        ChrononBond: chrononBond.deployTransaction.hash,
        ChrononVault: chrononVault.deployTransaction.hash,
        ChrononomicFinance: chrononomicFinance.deployTransaction.hash,
      },
      timestamp: new Date().toISOString(),
    }

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "../deployments")
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir)
    }

    // Write deployment info to file
    const filename = `deployment-${network.name}-${deploymentInfo.timestamp.split("T")[0]}.json`
    fs.writeFileSync(path.join(deploymentsDir, filename), JSON.stringify(deploymentInfo, null, 2))
    console.log(`Deployment information saved to deployments/${filename}`)

    // Generate a contracts.ts update
    console.log("\nUpdate your config/contracts.ts with these addresses:")
    console.log(`
// For network ID ${network.chainId} (${network.name})
${network.chainId}: {
  ChrononToken: "${chrononToken.address}",
  ChrononBond: "${chrononBond.address}",
  ChrononVault: "${chrononVault.address}",
  ChrononomicFinance: "${chrononomicFinance.address}",
},`)
  } catch (error) {
    console.error("Deployment failed:", error)
    throw error
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
