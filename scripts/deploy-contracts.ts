import { ethers } from "ethers"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Contract ABIs
import ChrononTokenABI from "../contracts/ChrononToken.json"
import ChrononBondABI from "../contracts/ChrononBond.json"
import ChrononVaultABI from "../contracts/ChrononVault.json"
import ChrononomicFinanceABI from "../contracts/ChrononomicFinance.json"

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

  console.log(`Deploying contracts with account: ${wallet.address}`)

  // Get the current balance
  const balance = await wallet.getBalance()
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`)

  // Deploy ChrononToken
  console.log("Deploying ChrononToken...")
  const initialSupply = ethers.utils.parseEther("1000000") // 1 million tokens
  const ChrononTokenFactory = new ethers.ContractFactory(
    ChrononTokenABI.abi,
    // Bytecode would be here in a real deployment script
    wallet,
  )

  const chrononToken = await ChrononTokenFactory.deploy(initialSupply)
  await chrononToken.deployed()
  console.log(`ChrononToken deployed to: ${chrononToken.address}`)

  // Deploy ChrononBond
  console.log("Deploying ChrononBond...")
  const ChrononBondFactory = new ethers.ContractFactory(
    ChrononBondABI.abi,
    // Bytecode would be here in a real deployment script
    wallet,
  )

  const chrononBond = await ChrononBondFactory.deploy(chrononToken.address)
  await chrononBond.deployed()
  console.log(`ChrononBond deployed to: ${chrononBond.address}`)

  // Deploy ChrononVault
  console.log("Deploying ChrononVault...")
  const ChrononVaultFactory = new ethers.ContractFactory(
    ChrononVaultABI.abi,
    // Bytecode would be here in a real deployment script
    wallet,
  )

  const chrononVault = await ChrononVaultFactory.deploy(chrononToken.address)
  await chrononVault.deployed()
  console.log(`ChrononVault deployed to: ${chrononVault.address}`)

  // Deploy ChrononomicFinance
  console.log("Deploying ChrononomicFinance...")
  const buyPrice = ethers.utils.parseEther("0.001") // 1 ETH = 1000 Chronons
  const sellPrice = ethers.utils.parseEther("0.0009") // Slightly lower sell price

  const ChrononomicFinanceFactory = new ethers.ContractFactory(
    ChrononomicFinanceABI.abi,
    // Bytecode would be here in a real deployment script
    wallet,
  )

  const chrononomicFinance = await ChrononomicFinanceFactory.deploy(
    chrononToken.address,
    chrononBond.address,
    chrononVault.address,
    buyPrice,
    sellPrice,
  )
  await chrononomicFinance.deployed()
  console.log(`ChrononomicFinance deployed to: ${chrononomicFinance.address}`)

  // Grant minter role to ChrononomicFinance
  console.log("Setting up permissions...")
  const minterRole = await chrononToken.MINTER_ROLE()
  const grantMinterTx = await chrononToken.grantRole(minterRole, chrononomicFinance.address)
  await grantMinterTx.wait()
  console.log("Minter role granted to ChrononomicFinance")

  // Output all contract addresses
  console.log("\nDeployment complete! Contract addresses:")
  console.log(`ChrononToken: ${chrononToken.address}`)
  console.log(`ChrononBond: ${chrononBond.address}`)
  console.log(`ChrononVault: ${chrononVault.address}`)
  console.log(`ChrononomicFinance: ${chrononomicFinance.address}`)

  // Save to a file for easy reference
  const fs = require("fs")
  const deploymentInfo = {
    network: await provider.getNetwork(),
    contracts: {
      ChrononToken: chrononToken.address,
      ChrononBond: chrononBond.address,
      ChrononVault: chrononVault.address,
      ChrononomicFinance: chrononomicFinance.address,
    },
    timestamp: new Date().toISOString(),
  }

  fs.writeFileSync(
    `deployment-${deploymentInfo.network.name}-${deploymentInfo.timestamp.split("T")[0]}.json`,
    JSON.stringify(deploymentInfo, null, 2),
  )
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
