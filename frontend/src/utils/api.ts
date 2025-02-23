import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    signUp: async (email: string, password: string, walletAddress: string, signature: string) => {
        const response = await api.post('/auth/signup', {
            email,
            password,
            walletAddress,
            signature,
        });
        return response.data;
    },

    signIn: async (email: string, password: string, signature: string) => {
        const response = await api.post('/auth/signin', {
            email,
            password,
            signature,
        });
        localStorage.setItem('token', response.data.token);
        return response.data;
    },
};

export const evidence = {
    submit: async (ipfsHash: string, metadata: string, signature: string) => {
        const response = await api.post('/evidence', {
            ipfsHash,
            metadata,
            signature,
        });
        return response.data;
    },
};