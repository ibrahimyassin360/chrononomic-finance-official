# Chrononomic Finance Mainnet Deployment Guide

This guide provides detailed instructions for deploying the Chrononomic Finance smart contracts to Ethereum mainnet. Mainnet deployment involves real ETH and should be approached with extreme caution.

## Prerequisites

### 1. Security Audit
- **Complete a professional audit** of all smart contracts
- Address all critical and high-severity issues
- Consider a bug bounty program before mainnet deployment

### 2. Thorough Testing
- Ensure 100% test coverage of all contract functions
- Complete extensive testing on multiple testnets (Sepolia, Goerli)
- Perform stress testing and simulation of edge cases

### 3. Infrastructure Setup
- Set up secure infrastructure for deployment
- Use a hardware wallet (Ledger, Trezor) for deployment
- Prepare secure, redundant RPC endpoints (Infura, Alchemy, private nodes)

### 4. Multisig Wallet
- Set up a multisig wallet for contract ownership
- Configure with trusted signers (minimum 3-of-5 recommended)
- Test the multisig thoroughly on testnets

### 5. Gas Estimation
- Calculate gas costs for all deployment transactions
- Ensure deployment wallet has sufficient ETH (minimum 2 ETH recommended)
- Monitor gas prices to find optimal deployment time

## Pre-Deployment Checklist

- [ ] All contracts have been audited by a reputable firm
- [ ] All critical and high-severity issues have been resolved
- [ ] Test coverage is at 100% for all contracts
- [ ] Contracts have been deployed and tested on multiple testnets
- [ ] Multisig wallet is set up and tested
- [ ] Deployment wallet has sufficient ETH
- [ ] Contract parameters are finalized and documented
- [ ] Deployment scripts are tested and verified
- [ ] Emergency response plan is in place
- [ ] Team members understand their roles during deployment

## Deployment Process

### 1. Preparation

\`\`\`bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Verify bytecode matches audited version
npx hardhat verify-bytecode
\`\`\`

### 2. Environment Setup

Create a secure `.env` file with the following variables:

\`\`\`
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
MAINNET_PRIVATE_KEY=your_hardware_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
\`\`\`

**IMPORTANT**: Never commit this file to version control. Use a hardware wallet for the private key whenever possible.

### 3. Deployment Dry Run

\`\`\`bash
# Perform a dry run to estimate gas and check for issues
npx hardhat run scripts/deploy-to-mainnet.ts --network hardhat
\`\`\`

### 4. Deployment Execution

\`\`\`bash
# Deploy to mainnet
npx hardhat run scripts/deploy-to-mainnet.ts --network mainnet
\`\`\`

The deployment script will:
1. Deploy ChrononToken
2. Deploy ChrononBond
3. Deploy ChrononVault
4. Deploy ChrononomicFinance
5. Set up permissions between contracts
6. Transfer ownership to the multisig wallet
7. Save deployment information to `deployments/deployment-mainnet-YYYY-MM-DD.json`

### 5. Contract Verification

\`\`\`bash
# Verify contracts on Etherscan
./scripts/verify-contracts.sh deployments/deployment-mainnet-YYYY-MM-DD.json
\`\`\`

### 6. Configuration Update

\`\`\`bash
# Update contract configuration
npx ts-node scripts/update-contract-config.ts
\`\`\`

## Post-Deployment Steps

### 1. Ownership Transfer

Confirm ownership has been transferred to the multisig wallet for all contracts:

\`\`\`bash
npx ts-node scripts/verify-ownership.ts
\`\`\`

### 2. Initial Setup

Execute initial setup transactions through the multisig wallet:
- Set initial parameters
- Approve initial operators
- Fund liquidity pools if applicable

### 3. Functionality Testing

Perform a comprehensive test of all contract functions on mainnet with minimal amounts:
- Test token transfers
- Test bond creation and redemption
- Test vault operations
- Test all admin functions through the multisig

### 4. Monitoring Setup

- Set up monitoring for contract events
- Configure alerts for unusual activity
- Implement a dashboard for key metrics

## Emergency Response Plan

### 1. Circuit Breaker
If a critical issue is discovered, use the circuit breaker function to pause the contracts:

\`\`\`bash
npx hardhat run scripts/emergency-pause.ts --network mainnet
\`\`\`

### 2. Communication Plan
- Prepare communication templates for different scenarios
- Designate team members responsible for communication
- Set up communication channels (Discord, Twitter, email)

### 3. Fix Deployment
Have a process ready for deploying fixes:
- Code review and audit process
- Deployment approval through multisig
- Verification and testing process

## Security Best Practices

### 1. Private Key Management
- Never store private keys in code or unencrypted files
- Use hardware wallets for all mainnet transactions
- Implement strict access controls for deployment infrastructure

### 2. Contract Upgrades
- Use transparent proxy patterns for upgradeable contracts
- Implement timelock mechanisms for upgrades
- Require multisig approval for all upgrades

### 3. Ongoing Monitoring
- Monitor contract events and transactions
- Set up alerts for unusual activity
- Regularly review security practices

## Troubleshooting

### Transaction Failures
- Check gas price and limits
- Verify nonce is correct
- Ensure contract parameters are valid

### Verification Issues
- Ensure compiler version matches deployment
- Check that constructor arguments are correctly formatted
- Verify that the contract source matches the deployed bytecode

## Mainnet Contract Addresses

After successful deployment, update this section with the contract addresses:

- ChrononToken: `0x...`
- ChrononBond: `0x...`
- ChrononVault: `0x...`
- ChrononomicFinance: `0x...`

## Support and Resources

- Technical Support: [support@chrononomic.finance](mailto:support@chrononomic.finance)
- Documentation: [docs.chrononomic.finance](https://docs.chrononomic.finance)
- GitHub Repository: [github.com/chrononomic/finance](https://github.com/chrononomic/finance)
\`\`\`

Now, let's create a mainnet deployment script:
