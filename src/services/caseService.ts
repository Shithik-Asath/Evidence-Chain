import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type CaseRecord = Database['public']['Tables']['case_records']['Row'];
type CaseInsert = Database['public']['Tables']['case_records']['Insert'];

export const caseService = {
  // Create new case
  async createCase(caseData: CaseInsert): Promise<CaseRecord> {
    const { data, error } = await supabase
      .from('case_records')
      .insert(caseData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create case: ${error.message}`);
    }

    return data;
  },

  // Get all cases
  async getAllCases(): Promise<CaseRecord[]> {
    const { data, error } = await supabase
      .from('case_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch cases: ${error.message}`);
    }

    return data || [];
  },

  // Get case by ID
  async getCaseById(id: string): Promise<CaseRecord | null> {
    const { data, error } = await supabase
      .from('case_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw new Error(`Failed to fetch case: ${error.message}`);
    }

    return data;
  },

  // Get case by case number
  async getCaseByCaseNumber(caseNumber: string): Promise<CaseRecord | null> {
    const { data, error } = await supabase
      .from('case_records')
      .select('*')
      .eq('case_number', caseNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw new Error(`Failed to fetch case: ${error.message}`);
    }

    return data;
  }
};