# Chrononomic Finance

A decentralized finance platform for time-based assets, built on Ethereum.

## Overview

Chrononomic Finance is a DeFi platform that allows users to tokenize time-based assets through the issuance and trading of time bonds. The platform uses the Chronon token as its native currency and provides various bond classes with different characteristics.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or another Ethereum wallet

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/chrononomic-finance.git
   cd chrononomic-finance
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Edit `.env.local` with your configuration.

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables.

## Smart Contracts

The platform consists of the following main contracts:

- **ChrononToken**: ERC20 token that serves as the platform's native currency
- **ChrononBond**: Manages the creation and redemption of time bonds
- **ChrononVault**: Holds collateral for issued bonds
- **ChrononomicFinance**: Main contract that coordinates the platform's functionality

## Deployment

### Testnet Deployment

For testnet deployment, see [SEPOLIA_DEPLOYMENT_GUIDE.md](./SEPOLIA_DEPLOYMENT_GUIDE.md).

### Mainnet Deployment

For mainnet deployment, see [MAINNET_DEPLOYMENT_GUIDE.md](./MAINNET_DEPLOYMENT_GUIDE.md).

## Testing

Run the test suite:

\`\`\`bash
npm test
\`\`\`

## Security

For security considerations, see [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
```

## Golden Gate Mint

This feature mints `20 \u03c7` when a verified Golden Gate Bridge photo is captured inside San Francisco.

### Setup

1. Install dependencies and run tests:
   ```bash
   npm install
   npm test
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Set `API_BASE_URL`, `VISION_API_KEY`, `RELAY_PRIVATE_KEY`, `RPC_URL`, `PRINTER_ADDRESS`, and `TRAINING_BUCKET`.

### Geofence

See `src/services/GeofenceService.ts` for the San Francisco polygon.

### Model Retraining

Images cached via `cache-training-image` feed the ML pipeline. Replace `models/bridge-detector-v1.tflite` when deploying new models.
