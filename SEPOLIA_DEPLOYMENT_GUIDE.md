# Sepolia Testnet Deployment Guide

This guide provides step-by-step instructions for deploying the Chrononomic Finance contracts to the Sepolia testnet.

## Prerequisites

1. **Sepolia ETH**: You need Sepolia ETH for gas fees. Get some from a faucet:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

2. **Ethereum RPC URL**: Get a Sepolia RPC URL from:
   - [Infura](https://infura.io/)
   - [Alchemy](https://www.alchemy.com/)
   - [QuickNode](https://www.quicknode.com/)

3. **Private Key**: Use a development wallet's private key (never use your main wallet)

4. **Etherscan API Key**: For contract verification (optional)

## Environment Setup

1. Create a `.env` file in the project root with:

\`\`\`
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn
\`\`\`

## Deployment Steps

### 1. Run the Deployment Script

\`\`\`bash
npx ts-node scripts/deploy-to-sepolia.ts
\`\`\`

This script will:
- Deploy all contracts to Sepolia
- Save deployment information to `deployments/deployment-sepolia-YYYY-MM-DD.json`
- Output the contract addresses and transaction hashes

### 2. Update Contract Configuration

After deployment, update your application's contract configuration:

\`\`\`bash
npx ts-node scripts/update-contract-config.ts
\`\`\`

This will automatically update the `config/contracts.ts` file with the new contract addresses.

### 3. Verify Contracts on Etherscan (Optional)

\`\`\`bash
chmod +x scripts/verify-contracts.sh
./scripts/verify-contracts.sh deployments/deployment-sepolia-YYYY-MM-DD.json
\`\`\`

### 4. Test the Deployed Contracts

\`\`\`bash
npx ts-node scripts/test-deployed-contracts.ts
\`\`\`

This will:
- Connect to your deployed contracts
- Test basic functionality
- Buy some Chronons
- Create a bond

## Troubleshooting

### Transaction Failures

- **Out of Gas**: Increase the gas limit in your transaction
- **Nonce Too Low**: Your transaction count is incorrect. Reset your MetaMask account
- **Insufficient Funds**: Get more Sepolia ETH from a faucet

### Contract Verification Failures

- **Constructor Arguments**: Ensure you're providing the correct constructor arguments
- **Compiler Version**: Make sure you're using the same compiler version as when you deployed
- **API Key**: Check that your Etherscan API key is correct

## Using the Deployed Contracts

After deployment, you can interact with your contracts through:

1. **Your Application**: Update the contract addresses in your app
2. **Etherscan**: Use the Sepolia Etherscan interface to call contract functions
3. **MetaMask**: Connect to Sepolia and interact with the contracts

## Next Steps

1. **Monitor Contracts**: Watch for events and transactions
2. **Test Thoroughly**: Ensure all functionality works as expected
3. **Prepare for Mainnet**: Plan your mainnet deployment strategy
