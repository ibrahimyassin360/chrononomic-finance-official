import * as dotenv from "dotenv"
import { createHash } from "crypto"

// Load environment variables
dotenv.config()

// Contract ABIs and bytecode
import ChrononTokenABI from "../contracts/ChrononToken.json"
import ChrononBondABI from "../contracts/ChrononBond.json"
import ChrononVaultABI from "../contracts/ChrononVault.json"
import ChrononomicFinanceABI from "../contracts/ChrononomicFinance.json"

// Audit bytecode hashes (to be filled with values from the audit report)
const AUDIT_BYTECODE_HASHES = {
  ChrononToken: "",
  ChrononBond: "",
  ChrononVault: "",
  ChrononomicFinance: "",
}

function hashBytecode(bytecode: string): string {
  return createHash("sha256").update(bytecode).digest("hex")
}

async function main() {
  console.log("🔍 Verifying contract bytecode against audit report...")

  // Hash the current bytecode
  const currentHashes = {
    ChrononToken: hashBytecode(ChrononTokenABI.bytecode),
    ChrononBond: hashBytecode(ChrononBondABI.bytecode),
    ChrononVault: hashBytecode(ChrononVaultABI.bytecode),
    ChrononomicFinance: hashBytecode(ChrononomicFinanceABI.bytecode),
  }

  console.log("\nCurrent bytecode hashes:")
  console.log(`ChrononToken: ${currentHashes.ChrononToken}`)
  console.log(`ChrononBond: ${currentHashes.ChrononBond}`)
  console.log(`ChrononVault: ${currentHashes.ChrononVault}`)
  console.log(`ChrononomicFinance: ${currentHashes.ChrononomicFinance}`)

  // Check if audit hashes are available
  const hasAuditHashes = Object.values(AUDIT_BYTECODE_HASHES).every((hash) => hash !== "")

  if (!hasAuditHashes) {
    console.log("\n⚠️ Audit bytecode hashes are not configured.")
    console.log("Please update the AUDIT_BYTECODE_HASHES object with values from the audit report.")
    return
  }

  // Compare with audit hashes
  console.log("\nComparing with audit bytecode hashes:")

  let allMatch = true

  for (const contract of ["ChrononToken", "ChrononBond", "ChrononVault", "ChrononomicFinance"] as const) {
    const currentHash = currentHashes[contract]
    const auditHash = AUDIT_BYTECODE_HASHES[contract]
    const matches = currentHash === auditHash

    console.log(`${contract}: ${matches ? "✅ Match" : "❌ MISMATCH"}`)

    if (!matches) {
      allMatch = false
    }
  }

  if (allMatch) {
    console.log("\n✅ All bytecode hashes match the audit report")
  } else {
    console.log("\n❌ Some bytecode hashes do not match the audit report")
    console.log("This could indicate that the contracts have been modified since the audit.")
    console.log("DO NOT proceed with deployment until this is resolved.")
  }
}

// Execute the verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Bytecode verification failed:")
    console.error(error)
    process.exit(1)
  })
