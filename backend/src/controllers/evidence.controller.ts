import { Request, Response } from 'express';
import pool from '../config/database';
import Web3 from 'web3';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const web3 = new Web3(process.env.WEB3_PROVIDER_URL!);
const contractABI = require('../contracts/EvidenceChain.json');
const contractAddress = process.env.CONTRACT_ADDRESS!;

const contract = new web3.eth.Contract(
    contractABI.abi,
    contractAddress
);

export const submitEvidence = async (req: Request, res: Response) => {
    const conn = await pool.getConnection();
    try {
        const { ipfsHash, metadata, signature } = req.body;

        // Verify signature
        const message = `Submit evidence: ${ipfsHash}`;
        const web3 = new Web3();
        const recoveredAddress = web3.eth.accounts.recover(message, signature);

        // Store in blockchain
        const result = await contract.methods
            .submitEvidence(ipfsHash, metadata)
            .send({ from: recoveredAddress });

        // Store in MySQL
        await conn.beginTransaction();
        
        const [rows] = await conn.execute<ResultSetHeader>(
            'INSERT INTO evidence_records (ipfs_hash, metadata, submitter_address, transaction_hash) VALUES (?, ?, ?, ?)',
            [ipfsHash, JSON.stringify(metadata), recoveredAddress, result.transactionHash]
        );

        await conn.commit();

        res.json({
            transactionHash: result.transactionHash,
            evidenceId: rows.insertId
        });
    } catch (error) {
        await conn.rollback();
        console.error('Evidence submission error:', error);
        res.status(500).json({ error: 'Failed to submit evidence' });
    } finally {
        conn.release();
    }
};

export const getEvidence = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM evidence_records ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching evidence:', error);
        res.status(500).json({ error: 'Failed to fetch evidence' });
    }
};

export const getEvidenceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM evidence_records WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Evidence not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching evidence:', error);
        res.status(500).json({ error: 'Failed to fetch evidence' });
    }
};