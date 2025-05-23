import { render, screen } from "@testing-library/react"
import BondCreator from "./bond-creator"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the hooks and services used by the component
jest.mock("../../hooks/use-bond-creator", () => ({
  useBondCreator: () => ({
    bondParams: {
      principal: 1000,
      tenor: 30,
      interestRate: 5,
      couponFrequency: "monthly",
      isHalal: false,
    },
    updateBondParams: jest.fn(),
    createBond: jest.fn(),
    isCreating: false,
    error: null,
  }),
}))

describe("BondCreator", () => {
  it("renders the bond creator form", () => {
    render(<BondCreator />)

    // Check if the main elements are rendered
    expect(screen.getByText(/Create a New Bond/i)).toBeInTheDocument()
    expect(screen.getByText(/Bond Parameters/i)).toBeInTheDocument()
    expect(screen.getByText(/Bond Preview/i)).toBeInTheDocument()
  })

  // Add more tests as needed
})
