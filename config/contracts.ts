// Contract addresses for different networks
export const CONTRACT_ADDRESSES: Record<number, Record<string, string>> = {
  // Ethereum Mainnet
  1: {
    ChrononToken: "",
    ChrononBond: "",
    ChrononVault: "",
    ChrononomicFinance: "",
  },
  // Goerli Testnet
  5: {
    ChrononToken: "0x1234567890123456789012345678901234567890",
    ChrononBond: "0x2345678901234567890123456789012345678901",
    ChrononVault: "0x3456789012345678901234567890123456789012",
    ChrononomicFinance: "0x4567890123456789012345678901234567890123",
  },
  // Sepolia Testnet
  11155111: {
    ChrononToken: "0x5678901234567890123456789012345678901234",
    ChrononBond: "0x6789012345678901234567890123456789012345",
    ChrononVault: "0x7890123456789012345678901234567890123456",
    ChrononomicFinance: "0x8901234567890123456789012345678901234567",
  },
  // Mumbai Testnet (Polygon)
  80001: {
    ChrononToken: "0x9012345678901234567890123456789012345678",
    ChrononBond: "0x0123456789012345678901234567890123456789",
    ChrononVault: "0xa123456789012345678901234567890123456789",
    ChrononomicFinance: "0xb123456789012345678901234567890123456789",
  },
}

// Network names for display
export const NETWORK_NAMES: Record<number, string> = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia Testnet",
  80001: "Mumbai Testnet (Polygon)",
}

// Supported networks
export const SUPPORTED_NETWORKS = [5, 11155111, 80001]
