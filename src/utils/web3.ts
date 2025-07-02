import Web3 from 'web3';

declare global {
    interface Window {
        ethereum?: any;
    }
}

// Updated Ganache configuration - using chain ID 1337 which is standard for Ganache
const GANACHE_URL = 'http://127.0.0.1:7545';
const GANACHE_NETWORK_ID = 1337; // Changed from 5777 to 1337

export const connectWallet = async (): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        // Check current network
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        
        console.log('Current network ID:', networkId);
        console.log('Expected network ID:', GANACHE_NETWORK_ID);
        
        if (Number(networkId) !== GANACHE_NETWORK_ID) {
            // Try to switch to Ganache network
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${GANACHE_NETWORK_ID.toString(16)}` }], // 0x539 for 1337
                });
            } catch (switchError: any) {
                // If network doesn't exist, add it
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${GANACHE_NETWORK_ID.toString(16)}`, // 0x539
                            chainName: 'Ganache Local Network',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: [GANACHE_URL],
                            blockExplorerUrls: null
                        }]
                    });
                } else {
                    throw switchError;
                }
            }
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found');
        }

        return accounts[0];
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
    }
};

export const signMessage = async (message: string): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const signature = await web3.eth.personal.sign(message, accounts[0], '');
        return signature;
    } catch (error) {
        console.error('Failed to sign message:', error);
        throw error;
    }
};

export const getWeb3Instance = () => {
    if (window.ethereum) {
        return new Web3(window.ethereum);
    } else {
        // Fallback to Ganache
        return new Web3(new Web3.providers.HttpProvider(GANACHE_URL));
    }
};

export const uploadEvidence = async (evidenceHash: string, metadata: string): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        
        // For now, we'll simulate a blockchain transaction
        // In production, you would deploy the smart contract and interact with it
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return mockTxHash;
    } catch (error) {
        console.error('Failed to upload evidence:', error);
        throw error;
    }
};