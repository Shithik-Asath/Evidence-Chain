import Web3 from 'web3';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const connectWallet = async (): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        const web3 = new Web3(window.ethereum);
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

export const uploadEvidence = async (evidenceHash: string, metadata: string): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        const web3 = new Web3(window.ethereum);
        // Replace with your actual contract address and ABI
        const contractAddress = 'YOUR_CONTRACT_ADDRESS';
        const contractABI = [];
        
        const contract = new web3.eth.Contract(contractABI as any, contractAddress);
        const accounts = await web3.eth.getAccounts();
        
        // Replace with your actual contract method
        const result = await contract.methods
            .uploadEvidence(evidenceHash, metadata)
            .send({ from: accounts[0] });
            
        return result.transactionHash;
    } catch (error) {
        console.error('Failed to upload evidence:', error);
        throw error;
    }
};