import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      evidence_records: {
        Row: {
          id: string;
          ipfs_hash: string;
          metadata: any;
          submitter_address: string;
          transaction_hash: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          ipfs_hash: string;
          metadata?: any;
          submitter_address: string;
          transaction_hash: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          ipfs_hash?: string;
          metadata?: any;
          submitter_address?: string;
          transaction_hash?: string;
          created_at?: string | null;
        };
      };
      case_records: {
        Row: {
          id: string;
          case_number: string;
          title: string;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          case_number: string;
          title: string;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          case_number?: string;
          title?: string;
          description?: string | null;
          created_at?: string | null;
        };
      };
    };
  };
};