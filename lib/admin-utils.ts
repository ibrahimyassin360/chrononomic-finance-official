// List of admin wallet addresses (lowercase)
const ADMIN_ADDRESSES: string[] = [
  "0xEbA59EFC8D7fB723c7F0e632064645fA5dA7fF3c", "0x873d04AbA5C845dd0AcBEBA5586E7E0632A5858D",
]

/**
 * Check if a wallet address has admin privileges
 * @param address Wallet address to check
 * @returns Boolean indicating if the address is an admin
 */
export function isAdminWallet(address: string | null | undefined): boolean {
  if (!address) return false

  // Convert to lowercase for case-insensitive comparison
  const normalizedAddress = address.toLowerCase()

  return ADMIN_ADDRESSES.includes(normalizedAddress)
}

/**
 * Mock admin check for preview mode
 * In preview mode, any connected wallet is considered an admin
 */
export function isPreviewAdmin(address: string | null | undefined): boolean {
  return !!address // Any connected address is admin in preview
}
