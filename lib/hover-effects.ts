import type React from "react"
/**
 * Creates a ripple effect on button click
 * @param event - The click event
 */
export function createRippleEffect(event: React.MouseEvent<HTMLButtonElement>) {
  const button = event.currentTarget

  // Remove any existing ripple elements
  const ripples = button.getElementsByClassName("ripple")
  while (ripples.length > 0) {
    ripples[0].remove()
  }

  // Create new ripple element
  const ripple = document.createElement("span")
  ripple.classList.add("ripple")
  button.appendChild(ripple)

  // Position the ripple
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  // Apply styles
  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`

  // Remove ripple after animation completes
  setTimeout(() => {
    ripple.remove()
  }, 600)
}
