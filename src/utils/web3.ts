import Web3 from 'web3';

declare global {
    interface Window {
        ethereum?: any;
    }
}

// Ganache configuration
const GANACHE_URL = 'http://127.0.0.1:7545';
const GANACHE_NETWORK_ID = 5777;

export const connectWallet = async (): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        // Check if we're connected to Ganache
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        
        if (Number(networkId) !== GANACHE_NETWORK_ID) {
            // Try to switch to Ganache network
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${GANACHE_NETWORK_ID.toString(16)}` }],
                });
            } catch (switchError: any) {
                // If network doesn't exist, add it
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${GANACHE_NETWORK_ID.toString(16)}`,
                            chainName: 'Ganache Local',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: [GANACHE_URL],
                            blockExplorerUrls: null
                        }]
                    });
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