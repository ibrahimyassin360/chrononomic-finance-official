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
    throw new Error("Insufficient balance. At least 0.1 ETH recommended for testing.")
  }

  const { ChrononToken, ChrononBond, ChrononVault, ChrononomicFinance } = deploymentInfo.contracts

  console.log("\n🧪 Testing deployed contracts...")

  // Connect to contracts
  const chrononToken = new ethers.Contract(ChrononToken, ChrononTokenABI.abi, wallet)
  const chrononBond = new ethers.Contract(ChrononBond, ChrononBondABI.abi, wallet)
  const chrononVault = new ethers.Contract(ChrononVault, ChrononVaultABI.abi, wallet)
  const chrononomicFinance = new ethers.Contract(ChrononomicFinance, ChrononomicFinanceABI.abi, wallet)

  // Test 1: Check token name and symbol
  console.log("\n📝 Test 1: Basic token information")
  const tokenName = await chrononToken.name()
  const tokenSymbol = await chrononToken.symbol()
  const tokenDecimals = await chrononToken.decimals()
  const tokenTotalSupply = await chrononToken.totalSupply()

  console.log(`Token Name: ${tokenName}`)
  console.log(`Token Symbol: ${tokenSymbol}`)
  console.log(`Token Decimals: ${tokenDecimals}`)
  console.log(`Total Supply: ${ethers.utils.formatUnits(tokenTotalSupply, tokenDecimals)}`)

  // Test 2: Check buy and sell prices
  console.log("\n📝 Test 2: Buy and sell prices")
  const buyPrice = await chrononomicFinance.buyPrice()
  const sellPrice = await chrononomicFinance.sellPrice()

  console.log(`Buy Price: ${ethers.utils.formatEther(buyPrice)} ETH per token`)
  console.log(`Sell Price: ${ethers.utils.formatEther(sellPrice)} ETH per token`)

  // Test 3: Buy a small amount of tokens
  console.log("\n📝 Test 3: Buy tokens")
  const buyAmount = ethers.utils.parseEther("0.01") // Buy with 0.01 ETH

  console.log(`Buying tokens with ${ethers.utils.formatEther(buyAmount)} ETH...`)

  // Get expected token amount
  const expectedTokens = buyAmount.mul(ethers.utils.parseEther("1")).div(buyPrice)
  console.log(`Expected tokens: ~${ethers.utils.formatUnits(expectedTokens, tokenDecimals)}`)

  // Check token balance before
  const tokenBalanceBefore = await chrononToken.balanceOf(wallet.address)
  console.log(`Token balance before: ${ethers.utils.formatUnits(tokenBalanceBefore, tokenDecimals)}`)

  // Buy tokens
  const buyTx = await chrononomicFinance.buyTokens({ value: buyAmount })
  console.log(`Transaction hash: ${buyTx.hash}`)
  console.log("Waiting for transaction confirmation...")
  await buyTx.wait()

  // Check token balance after
  const tokenBalanceAfter = await chrononToken.balanceOf(wallet.address)
  console.log(`Token balance after: ${ethers.utils.formatUnits(tokenBalanceAfter, tokenDecimals)}`)
  console.log(`Tokens received: ${ethers.utils.formatUnits(tokenBalanceAfter.sub(tokenBalanceBefore), tokenDecimals)}`)

  // Test 4: Create a bond
  console.log("\n📝 Test 4: Create a bond")

  // Approve tokens for bond creation
  const approveAmount = ethers.utils.parseUnits("10", tokenDecimals) // Approve 10 tokens
  console.log(`Approving ${ethers.utils.formatUnits(approveAmount, tokenDecimals)} tokens for bond creation...`)

  const approveTx = await chrononToken.approve(chrononBond.address, approveAmount)
  console.log(`Transaction hash: ${approveTx.hash}`)
  console.log("Waiting for transaction confirmation...")
  await approveTx.wait()

  // Create a bond
  const bondAmount = ethers.utils.parseUnits("5", tokenDecimals) // 5 tokens
  const maturityDays = 30 // 30 days
  const interestRate = 500 // 5% (500 basis points)

  console.log(
    `Creating a bond with ${ethers.utils.formatUnits(bondAmount, tokenDecimals)} tokens, ${maturityDays} days maturity, and ${interestRate / 100}% interest...`,
  )

  const createBondTx = await chrononBond.createBond(bondAmount, maturityDays, interestRate)
  console.log(`Transaction hash: ${createBondTx.hash}`)
  console.log("Waiting for transaction confirmation...")
  await createBondTx.wait()

  // Check bond count
  const bondCount = await chrononBond.getBondCount(wallet.address)
  console.log(`Bond count: ${bondCount.toString()}`)

  // Get bond details
  const bondId = bondCount.sub(1) // Latest bond
  const bond = await chrononBond.getBond(wallet.address, bondId)

  console.log(`Bond ID: ${bondId.toString()}`)
  console.log(`Bond Amount: ${ethers.utils.formatUnits(bond.amount, tokenDecimals)}`)
  console.log(`Creation Time: ${new Date(bond.creationTime.toNumber() * 1000).toISOString()}`)
  console.log(`Maturity Time: ${new Date(bond.maturityTime.toNumber() * 1000).toISOString()}`)
  console.log(`Interest Rate: ${bond.interestRate.toNumber() / 100}%`)
  console.log(`Redeemed: ${bond.redeemed}`)

  // Test 5: Sell a small amount of tokens
  console.log("\n📝 Test 5: Sell tokens")
  const sellTokenAmount = ethers.utils.parseUnits("1", tokenDecimals) // Sell 1 token

  console.log(`Selling ${ethers.utils.formatUnits(sellTokenAmount, tokenDecimals)} tokens...`)

  // Approve tokens for selling
  const approveSellTx = await chrononToken.approve(chrononomicFinance.address, sellTokenAmount)
  console.log(`Transaction hash: ${approveSellTx.hash}`)
  console.log("Waiting for transaction confirmation...")
  await approveSellTx.wait()

  // Get expected ETH amount
  const expectedEth = sellTokenAmount.mul(sellPrice).div(ethers.utils.parseEther("1"))
  console.log(`Expected ETH: ~${ethers.utils.formatEther(expectedEth)}`)

  // Check ETH balance before
  const ethBalanceBefore = await wallet.getBalance()

  // Sell tokens
  const sellTx = await chrononomicFinance.sellTokens(sellTokenAmount)
  console.log(`Transaction hash: ${sellTx.hash}`)
  console.log("Waiting for transaction confirmation...")
  const sellReceipt = await sellTx.wait()

  // Calculate gas cost
  const gasCost = sellReceipt.gasUsed.mul(sellReceipt.effectiveGasPrice)

  // Check ETH balance after
  const ethBalanceAfter = await wallet.getBalance()
  const ethReceived = ethBalanceAfter.add(gasCost).sub(ethBalanceBefore)

  console.log(`ETH received: ${ethers.utils.formatEther(ethReceived)}`)

  console.log("\n✅ All tests completed successfully!")
}

// Execute the tests
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Testing failed:")
    console.error(error)
    process.exit(1)
  })
