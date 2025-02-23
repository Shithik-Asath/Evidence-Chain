import Web3 from 'web3';
import { auth, evidence } from './api';

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

export const signUp = async (email: string, password: string): Promise<void> => {
    const walletAddress = await connectWallet();
    const message = `Sign this message to verify your wallet ownership: ${email}`;
    const signature = await signMessage(message);
    
    await auth.signUp(email, password, walletAddress, signature);
};

export const signIn = async (email: string, password: string): Promise<void> => {
    const message = `Sign this message to verify your wallet ownership: ${email}`;
    const signature = await signMessage(message);
    
    await auth.signIn(email, password, signature);
};

export const submitEvidence = async (ipfsHash: string, metadata: string): Promise<string> => {
    const message = `Submit evidence: ${ipfsHash}`;
    const signature = await signMessage(message);
    
    const result = await evidence.submit(ipfsHash, metadata, signature);
    return result.transactionHash;
};