# Chrononomic Finance Contract Deployment Guide

This guide provides instructions for deploying the Chrononomic Finance smart contracts to Ethereum networks.

## Prerequisites

- Node.js 14+ and npm/yarn installed
- MetaMask or another Ethereum wallet with testnet ETH
- An Ethereum RPC URL (from Infura, Alchemy, etc.)
- A private key for deployment (use a testnet account, never your mainnet account)

## Environment Setup

1. Create a `.env` file in the project root with the following variables:

\`\`\`
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn
\`\`\`

## Deployment Steps

1. Run the deployment script:

\`\`\`bash
npx ts-node scripts/deploy-contracts.ts
\`\`\`

2. The script will:
   - Deploy the ChrononToken contract
   - Deploy the ChrononBond contract
   - Deploy the ChrononVault contract
   - Deploy the ChrononomicFinance contract
   - Set up permissions between contracts
   - Output all contract addresses

3. After deployment, a JSON file with all contract addresses will be created in the project root.

4. Update the `config/contracts.ts` file with the new contract addresses.

## Contract Verification

After deployment, verify your contracts on Etherscan:

1. Install the Hardhat Etherscan plugin:

\`\`\`bash
npm install --save-dev @nomiclabs/hardhat-etherscan
\`\`\`

2. Add your Etherscan API key to the `.env` file:

\`\`\`
ETHERSCAN_API_KEY=your_etherscan_api_key
\`\`\`

3. Run the verification command for each contract:

\`\`\`bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS constructor_argument_1 constructor_argument_2
\`\`\`

## Testing the Deployment

1. Connect your MetaMask to the deployed network
2. Import the ChrononToken contract using its address
3. Try minting tokens, creating bonds, and using the finance functions

## Troubleshooting

- If you encounter gas errors, try increasing the gas limit
- If transactions fail, check that your account has enough ETH
- For permission errors, ensure the correct roles are assigned

## Security Considerations

- Always deploy to testnets first before mainnet
- Use a dedicated deployment account with limited funds
- Audit contracts thoroughly before mainnet deployment
- Consider using a multisig wallet for contract ownership
\`\`\`

Let's create a simple contract interaction test script:
