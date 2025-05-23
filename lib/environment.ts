/**
 * Safely detects if we're in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined"
}

/**
 * Safely detects if we're in a preview/development environment
 * This is called during rendering, so it needs to be safe for SSR
 */
export const isPreviewMode = (): boolean => {
  // Server-side rendering is treated as preview mode
  if (!isBrowser()) {
    return true
  }

  // Check if we're in development mode
  if (process.env.NODE_ENV === "development") {
    return true
  }

  // Don't try to access window.ethereum directly during initial render
  // This will be determined after hydration
  return false
}

/**
 * Safely checks if Ethereum provider is available
 * Only call this function in client components after mounting
 */
export const hasEthereumProvider = (): boolean => {
  return isBrowser() && typeof window.ethereum !== "undefined"
}
