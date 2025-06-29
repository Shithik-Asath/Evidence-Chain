import { useState, useEffect } from 'react';
import { evidenceService } from '../services/evidenceService';
import type { Database } from '../lib/supabase';

type EvidenceRecord = Database['public']['Tables']['evidence_records']['Row'];

export const useEvidence = () => {
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await evidenceService.getAllEvidence();
      setEvidence(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch evidence');
    } finally {
      setLoading(false);
    }
  };

  const submitEvidence = async (evidenceData: {
    ipfs_hash: string;
    metadata: any;
    submitter_address: string;
    transaction_hash: string;
  }) => {
    try {
      const newEvidence = await evidenceService.submitEvidence(evidenceData);
      setEvidence(prev => [newEvidence, ...prev]);
      return newEvidence;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to submit evidence');
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  return {
    evidence,
    loading,
    error,
    fetchEvidence,
    submitEvidence
  };
};