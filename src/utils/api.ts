import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

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