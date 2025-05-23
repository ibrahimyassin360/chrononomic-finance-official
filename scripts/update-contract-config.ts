import fs from "fs"
import path from "path"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

async function main() {
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

  // Read the current contracts.ts file
  const contractsFilePath = path.join(__dirname, "../config/contracts.ts")
  if (!fs.existsSync(contractsFilePath)) {
    throw new Error("contracts.ts file not found.")
  }

  let contractsFileContent = fs.readFileSync(contractsFilePath, "utf8")

  // Extract the network information
  const { chainId } = latestDeployment.network
  const { ChrononToken, ChrononBond, ChrononVault, ChrononomicFinance } = latestDeployment.contracts

  // Check if the network already exists in the file
  const networkRegex = new RegExp(`${chainId}:\\s*{[^}]*},?`, "s")
  const networkExists = networkRegex.test(contractsFileContent)

  // Create the new network entry
  const newNetworkEntry = `  ${chainId}: {
    ChrononToken: "${ChrononToken}",
    ChrononBond: "${ChrononBond}",
    ChrononVault: "${ChrononVault}",
    ChrononomicFinance: "${ChrononomicFinance}",
  },`

  // Update the file content
  if (networkExists) {
    // Replace the existing network entry
    contractsFileContent = contractsFileContent.replace(networkRegex, newNetworkEntry)
  } else {
    // Add the new network entry before the last closing brace
    contractsFileContent = contractsFileContent.replace(/}(\s*)$/, `  ${newNetworkEntry}\n}$1`)
  }

  // Write the updated content back to the file
  fs.writeFileSync(contractsFilePath, contractsFileContent)

  console.log(`Updated config/contracts.ts with the latest deployment on network ${chainId}`)
  console.log("Contract addresses:")
  console.log(`ChrononToken: ${ChrononToken}`)
  console.log(`ChrononBond: ${ChrononBond}`)
  console.log(`ChrononVault: ${ChrononVault}`)
  console.log(`ChrononomicFinance: ${ChrononomicFinance}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
