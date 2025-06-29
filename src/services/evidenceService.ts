import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type EvidenceRecord = Database['public']['Tables']['evidence_records']['Row'];
type EvidenceInsert = Database['public']['Tables']['evidence_records']['Insert'];

export const evidenceService = {
  // Submit new evidence
  async submitEvidence(evidence: EvidenceInsert): Promise<EvidenceRecord> {
    const { data, error } = await supabase
      .from('evidence_records')
      .insert(evidence)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to submit evidence: ${error.message}`);
    }

    return data;
  },

  // Get all evidence records
  async getAllEvidence(): Promise<EvidenceRecord[]> {
    const { data, error } = await supabase
      .from('evidence_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch evidence: ${error.message}`);
    }

    return data || [];
  },

  // Get evidence by ID
  async getEvidenceById(id: string): Promise<EvidenceRecord | null> {
    const { data, error } = await supabase
      .from('evidence_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw new Error(`Failed to fetch evidence: ${error.message}`);
    }

    return data;
  },

  // Get evidence by submitter address
  async getEvidenceBySubmitter(address: string): Promise<EvidenceRecord[]> {
    const { data, error } = await supabase
      .from('evidence_records')
      .select('*')
      .eq('submitter_address', address)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch evidence: ${error.message}`);
    }

    return data || [];
  }
};