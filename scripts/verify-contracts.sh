#!/bin/bash

# This script verifies the deployed contracts on Etherscan
# Usage: ./verify-contracts.sh <deployment-file>

# Check if deployment file is provided
if [ -z "$1" ]; then
  echo "Usage: ./verify-contracts.sh <deployment-file>"
  exit 1
fi

# Check if the file exists
if [ ! -f "$1" ]; then
  echo "Deployment file not found: $1"
  exit 1
fi

# Extract contract addresses and deployment info
NETWORK=$(jq -r '.network.name' "$1")
CHAIN_ID=$(jq -r '.network.chainId' "$1")
TOKEN_ADDRESS=$(jq -r '.contracts.ChrononToken' "$1")
BOND_ADDRESS=$(jq -r '.contracts.ChrononBond' "$1")
VAULT_ADDRESS=$(jq -r '.contracts.ChrononVault' "$1")
FINANCE_ADDRESS=$(jq -r '.contracts.ChrononomicFinance' "$1")

# Check if ETHERSCAN_API_KEY is set
if [ -z "$ETHERSCAN_API_KEY" ]; then
  echo "ETHERSCAN_API_KEY environment variable is not set"
  exit 1
fi

echo "Verifying contracts on $NETWORK (Chain ID: $CHAIN_ID)"

# Verify ChrononToken
echo "Verifying ChrononToken at $TOKEN_ADDRESS"
npx hardhat verify --network $NETWORK $TOKEN_ADDRESS 1000000000000000000000000

# Verify ChrononBond
echo "Verifying ChrononBond at $BOND_ADDRESS"
npx hardhat verify --network $NETWORK $BOND_ADDRESS $TOKEN_ADDRESS

# Verify ChrononVault
echo "Verifying ChrononVault at $VAULT_ADDRESS"
npx hardhat verify --network $NETWORK $VAULT_ADDRESS $TOKEN_ADDRESS

# Verify ChrononomicFinance
echo "Verifying ChrononomicFinance at $FINANCE_ADDRESS"
npx hardhat verify --network $NETWORK $FINANCE_ADDRESS $TOKEN_ADDRESS $BOND_ADDRESS $VAULT_ADDRESS 1000000000000000 900000000000000

echo "Verification complete!"
