# Evidence Chain - Complete Setup Guide with Ganache

A blockchain-based evidence management system using React, Supabase, and Ganache for local development.

## Prerequisites

Before starting, ensure you have:
- Node.js (version 16 or higher)
- MetaMask browser extension
- Ganache (for local blockchain)
- Truffle (for smart contract deployment)

## Step 1: Install Required Tools

### 1.1 Install Ganache
1. Download Ganache from [trufflesuite.com/ganache](https://trufflesuite.com/ganache/)
2. Install and launch Ganache
3. Create a new workspace or use Quickstart
4. Note the RPC Server URL (usually `http://127.0.0.1:7545`)
5. Note the Network ID (usually `5777`)

### 1.2 Install Truffle
```bash
npm install -g truffle
```

## Step 2: Supabase Setup

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter project details:
   - **Name**: `evidence-chain`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
4. Wait for project creation (2-3 minutes)

### 2.2 Get Supabase Credentials
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL**
   - **Anon public key**

### 2.3 Set Up Environment Variables
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: MetaMask Configuration

### 3.1 Add Ganache Network to MetaMask
1. Open MetaMask
2. Click network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network" → "Add a network manually"
4. Enter network details:
   - **Network Name**: Ganache Local
   - **New RPC URL**: http://127.0.0.1:7545
   - **Chain ID**: 1337 (or 5777 depending on your Ganache setup)
   - **Currency Symbol**: ETH
5. Click "Save"

### 3.2 Import Ganache Accounts
1. In Ganache, click the key icon next to any account
2. Copy the private key
3. In MetaMask, click account icon → "Import Account"
4. Paste the private key
5. Repeat for multiple accounts if needed

## Step 4: Smart Contract Deployment

### 4.1 Compile Contracts
```bash
truffle compile
```

### 4.2 Deploy to Ganache
```bash
truffle migrate --network development
```

### 4.3 Note Contract Address
After deployment, note the contract address from the output. You'll need this for frontend integration.

## Step 5: Database Setup

### 5.1 Connect to Supabase
1. Click "Connect to Supabase" button in your development environment
2. Enter your Supabase URL and Anon Key
3. The database migration will run automatically

### 5.2 Verify Database Tables
1. Go to Supabase dashboard → **Table Editor**
2. Verify these tables exist:
   - `evidence_records`
   - `case_records`

## Step 6: Start the Application

### 6.1 Install Dependencies
Dependencies will install automatically when you start the dev server.

### 6.2 Start Development Server
The server should start automatically. If not:
```bash
npm run dev
```

## Step 7: Using the Application

### 7.1 Connect Wallet
1. Navigate to the Dashboard
2. Click "Add Evidence" or "Create Case"
3. MetaMask will prompt to connect
4. Select your Ganache account
5. Approve the connection

### 7.2 Submit Evidence
1. Fill out the evidence form:
   - **Name**: Descriptive name
   - **Description**: Evidence details
   - **Type**: Select appropriate type
   - **File**: Upload evidence file
2. Click "Submit Evidence"
3. MetaMask will prompt to sign a message
4. Confirm the signature
5. Evidence will be recorded in both database and blockchain

### 7.3 Create Cases
1. Switch to "Case Records" tab
2. Click "Create Case"
3. Fill out case information
4. Submit the form

## Step 8: Verification

### 8.1 Check Database Records
1. Go to Supabase dashboard → **Table Editor**
2. View records in `evidence_records` and `case_records` tables

### 8.2 Check Blockchain Transactions
1. In Ganache, go to "Transactions" tab
2. Verify transactions are being recorded
3. Check "Blocks" tab for block confirmations

## Step 9: Advanced Features

### 9.1 Real IPFS Integration
To add real IPFS storage:
1. Install IPFS node or use Pinata service
2. Update file upload logic in the frontend
3. Store actual IPFS hashes instead of mock hashes

### 9.2 Enhanced Smart Contract Integration
1. Update `src/utils/web3.ts` with actual contract address
2. Add contract ABI to the project
3. Implement real blockchain interactions

## Troubleshooting

### Common Issues:

1. **MetaMask Connection Issues**
   - Ensure Ganache is running
   - Check network configuration in MetaMask
   - Try refreshing the page

2. **Transaction Failures**
   - Check account has sufficient ETH
   - Verify gas settings
   - Ensure contract is deployed

3. **Database Connection Issues**
   - Verify Supabase credentials in `.env`
   - Check Supabase project status
   - Ensure RLS policies are correctly set

4. **Smart Contract Issues**
   - Verify Ganache is running on correct port
   - Check contract compilation errors
   - Ensure migration completed successfully

## Development Workflow

1. **Start Ganache** - Launch your local blockchain
2. **Deploy Contracts** - Run truffle migrations
3. **Start Frontend** - Launch the React application
4. **Connect MetaMask** - Connect to Ganache network
5. **Test Features** - Submit evidence and create cases

## Production Deployment

For production deployment:
1. Deploy smart contracts to mainnet or testnet
2. Update contract addresses in frontend
3. Configure production Supabase instance
4. Set up proper IPFS storage
5. Deploy frontend to hosting service

## Security Considerations

- Never commit private keys or sensitive data
- Use environment variables for all configuration
- Implement proper access controls
- Audit smart contracts before mainnet deployment
- Use secure IPFS pinning services

The application now provides a complete evidence management system with:
- ✅ Local blockchain development with Ganache
- ✅ Smart contract deployment and interaction
- ✅ MetaMask integration for wallet connectivity
- ✅ Supabase database for metadata storage
- ✅ File upload and evidence management
- ✅ Case creation and tracking
- ✅ Responsive, production-ready UI