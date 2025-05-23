import { ethers } from "ethers"

// Mock account data
const MOCK_ACCOUNT = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
const MOCK_BALANCE = ethers.parseEther("10.0")
const MOCK_CHAIN_ID = 1 // Ethereum Mainnet

// Mock transaction data
const MOCK_TX_HASH = "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"

// Mock provider class that simulates Ethereum provider behavior
export class MockProvider {
  private listeners: Record<string, Function[]> = {
    accountsChanged: [],
    chainChanged: [],
    disconnect: [],
  }

  // Simulate request method
  async request({ method, params }: { method: string; params?: any[] }): Promise<any> {
    console.log(`Mock provider: ${method}`, params)

    switch (method) {
      case "eth_accounts":
      case "eth_requestAccounts":
        return [MOCK_ACCOUNT]

      case "eth_chainId":
        return "0x1" // Ethereum Mainnet

      case "eth_getBalance":
        return MOCK_BALANCE.toString()

      case "eth_sendTransaction":
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return MOCK_TX_HASH

      case "wallet_switchEthereumChain":
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        return null

      default:
        throw new Error(`Method ${method} not implemented in mock provider`)
    }
  }

  // Event listener methods
  on(event: string, listener: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
  }

  removeListener(event: string, listener: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((l) => l !== listener)
    }
  }

  // Method to simulate events (for testing)
  simulateEvent(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(...args))
    }
  }
}

// Create a singleton instance
export const mockProvider = new MockProvider()
