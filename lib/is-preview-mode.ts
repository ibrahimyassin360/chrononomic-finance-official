// Check if we're in a preview/development environment
export const isPreviewMode = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return true // Server-side rendering is treated as preview mode
  }

  // Check if we're in development mode
  if (process.env.NODE_ENV === "development") {
    return true
  }

  // Check if window.ethereum is available
  if (!window.ethereum) {
    return true
  }

  return false
}
