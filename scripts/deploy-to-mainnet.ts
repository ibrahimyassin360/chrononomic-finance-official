import { ethers } from "ethers"
import * as dotenv from "dotenv"
import fs from "fs"
import path from "path"

// Load environment variables
dotenv.config()

// Validate required environment variables
function validateEnvironment() {
  const requiredVars = ["MAINNET_RPC_URL", "MAINNET_PRIVATE_KEY", "ETHERSCAN_API_KEY"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  // Validate RPC URL format
  const rpcUrl = process.env.MAINNET_RPC_URL
  if (!rpcUrl?.startsWith("https://")) {
    throw new Error("MAINNET_RPC_URL must be a valid HTTPS URL")
  }

  // Validate private key format (basic check)
  const privateKey = process.env.MAINNET_PRIVATE_KEY
  if (!privateKey?.startsWith("0x") || privateKey.length !== 66) {
    throw new Error("MAINNET_PRIVATE_KEY must be a valid Ethereum private key (0x prefix + 64 hex chars)")
  }
}

// Contract ABIs
import ChrononTokenABI from "../contracts/ChrononToken.json"
import ChrononBondABI from "../contracts/ChrononBond.json"
import ChrononVaultABI from "../contracts/ChrononVault.json"
import ChrononomicFinanceABI from "../contracts/ChrononomicFinance.json"

// Deployment configuration
const DEPLOYMENT_CONFIG = {
  initialTokenSupply: ethers.utils.parseEther("1000000"), // 1 million tokens
  buyPrice: ethers.utils.parseEther("0.001"), // 1 ETH = 1000 Chronons
  sellPrice: ethers.utils.parseEther("0.0009"), // Slightly lower sell price
  // Multisig wallet address that will own the contracts
  multisigAddress: process.env.MULTISIG_ADDRESS || "",
}

async function main() {
  // Validate environment variables
  validateEnvironment()

  // Validate multisig address
  if (!DEPLOYMENT_CONFIG.multisigAddress || DEPLOYMENT_CONFIG.multisigAddress === "") {
    throw new Error("Multisig address not configured. Set the MULTISIG_ADDRESS environment variable.")
  }

  // Check if we're on mainnet
  if (process.env.NODE_ENV !== "production") {
    console.warn("\n⚠️  WARNING: You are not in production mode!")
    console.warn("⚠️  This script is intended for mainnet deployment only.")
    console.warn("⚠️  Set NODE_ENV=production to proceed with actual deployment.\n")

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise((resolve) => {
      readline.question("Do you want to continue with the dry run? (yes/no): ", (answer: string) => {
        readline.close()
        if (answer.toLowerCase() !== "yes") {
          console.log("Deployment cancelled.")
          process.exit(0)
        }
        console.log("Continuing with dry run...\n")
        resolve(performDeployment())
      })
    })
  }

  return performDeployment()
}

async function performDeployment() {
  // Check if private key is available
  if (!process.env.MAINNET_PRIVATE_KEY) {
    throw new Error("Missing MAINNET_PRIVATE_KEY environment variable")
  }

  // Check if RPC URL is available
  if (!process.env.MAINNET_RPC_URL) {
    throw new Error("Missing MAINNET_RPC_URL environment variable")
  }

  // Check if multisig address is set
  if (DEPLOYMENT_CONFIG.multisigAddress === "") {
    throw new Error("Multisig address not configured. Update the DEPLOYMENT_CONFIG.")
  }

  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL)
  const wallet = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY, provider)

  // Get network information
  const network = await provider.getNetwork()
  console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`)

  if (network.chainId === 1) {
    console.log("\n🚨 ATTENTION: You are deploying to ETHEREUM MAINNET 🚨")
    console.log("This will use REAL ETH and deploy PRODUCTION contracts.\n")

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    await new Promise((resolve) => {
      readline.question("Type 'DEPLOY TO MAINNET' to confirm: ", (answer: string) => {
        readline.close()
        if (answer !== "DEPLOY TO MAINNET") {
          console.log("Deployment cancelled.")
          process.exit(0)
        }
        console.log("Proceeding with mainnet deployment...\n")
        resolve(null)
      })
    })
  }

  console.log(`Deploying contracts with account: ${wallet.address}`)

  // Get the current balance
  const balance = await wallet.getBalance()
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`)

  // Check if balance is sufficient (at least 1 ETH)
  if (balance.lt(ethers.utils.parseEther("1"))) {
    throw new Error("Insufficient balance. At least 1 ETH recommended for deployment.")
  }

  // Get current gas price
  const gasPrice = await provider.getGasPrice()
  console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`)

  // Deploy ChrononToken
  console.log("\n📄 Deploying ChrononToken...")
  const ChrononTokenFactory = new ethers.ContractFactory(ChrononTokenABI.abi, ChrononTokenABI.bytecode, wallet)

  const chrononToken = await ChrononTokenFactory.deploy(DEPLOYMENT_CONFIG.initialTokenSupply, { gasPrice })

  console.log(`Transaction hash: ${chrononToken.deployTransaction.hash}`)
  console.log("Waiting for transaction confirmation...")

  await chrononToken.deployed()
  console.log(`✅ ChrononToken deployed to: ${chrononToken.address}`)

  // Deploy ChrononBond
  console.log("\n📄 Deploying ChrononBond...")
  const ChrononBondFactory = new ethers.ContractFactory(ChrononBondABI.abi, ChrononBondABI.bytecode, wallet)

  const chrononBond = await ChrononBondFactory.deploy(chrononToken.address, { gasPrice })

  console.log(`Transaction hash: ${chrononBond.deployTransaction.hash}`)
  console.log("Waiting for transaction confirmation...")

  await chrononBond.deployed()
  console.log(`✅ ChrononBond deployed to: ${chrononBond.address}`)

  // Deploy ChrononVault
  console.log("\n📄 Deploying ChrononVault...")
  const ChrononVaultFactory = new ethers.ContractFactory(ChrononVaultABI.abi, ChrononVaultABI.bytecode, wallet)

  const chrononVault = await ChrononVaultFactory.deploy(chrononToken.address, { gasPrice })

  console.log(`Transaction hash: ${chrononVault.deployTransaction.hash}`)
  console.log("Waiting for transaction confirmation...")

  await chrononVault.deployed()
  console.log(`✅ ChrononVault deployed to: ${chrononVault.address}`)

  // Deploy ChrononomicFinance
  console.log("\n📄 Deploying ChrononomicFinance...")
  const ChrononomicFinanceFactory = new ethers.ContractFactory(
    ChrononomicFinanceABI.abi,
    ChrononomicFinanceABI.bytecode,
    wallet,
  )

  const chrononomicFinance = await ChrononomicFinanceFactory.deploy(
    chrononToken.address,
    chrononBond.address,
    chrononVault.address,
    DEPLOYMENT_CONFIG.buyPrice,
    DEPLOYMENT_CONFIG.sellPrice,
    { gasPrice },
  )

  console.log(`Transaction hash: ${chrononomicFinance.deployTransaction.hash}`)
  console.log("Waiting for transaction confirmation...")

  await chrononomicFinance.deployed()
  console.log(`✅ ChrononomicFinance deployed to: ${chrononomicFinance.address}`)

  // Grant minter role to ChrononomicFinance
  console.log("\n🔑 Setting up permissions...")
  const minterRole = await chrononToken.MINTER_ROLE()
  console.log(`Granting minter role (${minterRole}) to ChrononomicFinance...`)

  const grantMinterTx = await chrononToken.grantRole(minterRole, chrononomicFinance.address, { gasPrice })

  console.log(`Transaction hash: ${grantMinterTx.hash}`)
  console.log("Waiting for transaction confirmation...")

  await grantMinterTx.wait()
  console.log("✅ Minter role granted to ChrononomicFinance")

  // Transfer ownership to multisig
  console.log("\n🔑 Transferring ownership to multisig...")

  // Transfer ChrononToken admin role
  const adminRole = await chrononToken.DEFAULT_ADMIN_ROLE()
  console.log(`Granting admin role (${adminRole}) to multisig...`)

  const grantAdminTx = await chrononToken.grantRole(adminRole, DEPLOYMENT_CONFIG.multisigAddress, { gasPrice })

  console.log(`Transaction hash: ${grantAdminTx.hash}`)
  console.log("Waiting for transaction confirmation...")

  await grantAdminTx.wait()
  console.log("✅ Admin role granted to multisig")

  // Renounce admin role from deployer
  console.log(`Renouncing admin role from deployer...`)

  const renounceAdminTx = await chrononToken.renounceRole(adminRole, wallet.address, { gasPrice })

  console.log(`Transaction hash: ${renounceAdminTx.hash}`)
  console.log("Waiting for transaction confirmation...")

  await renounceAdminTx.wait()
  console.log("✅ Admin role renounced from deployer")

  // Transfer ownership of other contracts
  // Note: This assumes each contract has a transferOwnership function
  // Adjust as needed based on your actual contract implementations

  console.log(`Transferring ChrononBond ownership to multisig...`)
  const transferBondTx = await chrononBond.transferOwnership(DEPLOYMENT_CONFIG.multisigAddress, { gasPrice })

  console.log(`Transaction hash: ${transferBondTx.hash}`)
  await transferBondTx.wait()
  console.log("✅ ChrononBond ownership transferred to multisig")

  console.log(`Transferring ChrononVault ownership to multisig...`)
  const transferVaultTx = await chrononVault.transferOwnership(DEPLOYMENT_CONFIG.multisigAddress, { gasPrice })

  console.log(`Transaction hash: ${transferVaultTx.hash}`)
  await transferVaultTx.wait()
  console.log("✅ ChrononVault ownership transferred to multisig")

  console.log(`Transferring ChrononomicFinance ownership to multisig...`)
  const transferFinanceTx = await chrononomicFinance.transferOwnership(DEPLOYMENT_CONFIG.multisigAddress, { gasPrice })

  console.log(`Transaction hash: ${transferFinanceTx.hash}`)
  await transferFinanceTx.wait()
  console.log("✅ ChrononomicFinance ownership transferred to multisig")

  // Output all contract addresses
  console.log("\n🎉 Deployment complete! Contract addresses:")
  console.log(`ChrononToken: ${chrononToken.address}`)
  console.log(`ChrononBond: ${chrononBond.address}`)
  console.log(`ChrononVault: ${chrononVault.address}`)
  console.log(`ChrononomicFinance: ${chrononomicFinance.address}`)

  // Save deployment information
  const deploymentsDir = path.join(__dirname, "../deployments")
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true })
  }

  const deploymentInfo = {
    network: {
      name: network.name,
      chainId: network.chainId,
    },
    deployer: wallet.address,
    contracts: {
      ChrononToken: chrononToken.address,
      ChrononBond: chrononBond.address,
      ChrononVault: chrononVault.address,
      ChrononomicFinance: chrononomicFinance.address,
    },
    transactions: {
      ChrononToken: chrononToken.deployTransaction.hash,
      ChrononBond: chrononBond.deployTransaction.hash,
      ChrononVault: chrononVault.deployTransaction.hash,
      ChrononomicFinance: chrononomicFinance.deployTransaction.hash,
      grantMinterRole: grantMinterTx.hash,
      grantAdminRole: grantAdminTx.hash,
      renounceAdminRole: renounceAdminTx.hash,
      transferBondOwnership: transferBondTx.hash,
      transferVaultOwnership: transferVaultTx.hash,
      transferFinanceOwnership: transferFinanceTx.hash,
    },
    config: {
      initialTokenSupply: DEPLOYMENT_CONFIG.initialTokenSupply.toString(),
      buyPrice: DEPLOYMENT_CONFIG.buyPrice.toString(),
      sellPrice: DEPLOYMENT_CONFIG.sellPrice.toString(),
      multisigAddress: DEPLOYMENT_CONFIG.multisigAddress,
    },
    timestamp: new Date().toISOString(),
  }

  const deploymentFileName = `deployment-${network.name}-${deploymentInfo.timestamp.split("T")[0]}.json`
  fs.writeFileSync(path.join(deploymentsDir, deploymentFileName), JSON.stringify(deploymentInfo, null, 2))

  console.log(`\n📝 Deployment information saved to: deployments/${deploymentFileName}`)
  console.log("\n⚠️  IMPORTANT NEXT STEPS:")
  console.log("1. Verify contracts on Etherscan")
  console.log("2. Update contract configuration in your application")
  console.log("3. Test all functionality with minimal amounts")
  console.log("4. Set up monitoring for contract events")
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:")
    console.error(error)
    process.exit(1)
  })
