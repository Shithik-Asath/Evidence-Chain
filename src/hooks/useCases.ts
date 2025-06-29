import { useState, useEffect } from 'react';
import { caseService } from '../services/caseService';
import type { Database } from '../lib/supabase';

type CaseRecord = Database['public']['Tables']['case_records']['Row'];

export const useCases = () => {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await caseService.getAllCases();
      setCases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (caseData: {
    case_number: string;
    title: string;
    description?: string;
  }) => {
    try {
      const newCase = await caseService.createCase(caseData);
      setCases(prev => [newCase, ...prev]);
      return newCase;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create case');
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    loading,
    error,
    fetchCases,
    createCase
  };
};