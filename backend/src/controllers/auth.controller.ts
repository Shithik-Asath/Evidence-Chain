import { Request, Response } from 'express';
import { supabase } from '../config/database';
import jwt from 'jsonwebtoken';
import Web3 from 'web3';

export const signUp = async (req: Request, res: Response) => {
    try {
        const { email, password, walletAddress, signature } = req.body;

        // Verify wallet ownership
        const message = `Sign this message to verify your wallet ownership: ${email}`;
        const web3 = new Web3();
        const recoveredAddress = web3.eth.accounts.recover(message, signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Create user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        // Link wallet address to user
        const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
                {
                    user_id: authData.user?.id,
                    wallet_address: walletAddress,
                }
            ]);

        if (profileError) throw profileError;

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password, signature } = req.body;

        // Authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) throw authError;

        // Get user's wallet address
        const { data: profileData } = await supabase
            .from('user_profiles')
            .select('wallet_address')
            .eq('user_id', authData.user?.id)
            .single();

        // Verify wallet signature
        const message = `Sign this message to verify your wallet ownership: ${email}`;
        const web3 = new Web3();
        const recoveredAddress = web3.eth.accounts.recover(message, signature);

        if (recoveredAddress.toLowerCase() !== profileData.wallet_address.toLowerCase()) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: authData.user?.id, walletAddress: profileData.wallet_address },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Failed to sign in' });
    }
};