/*
  # Evidence Chain Database Schema

  1. New Tables
    - `evidence_records`
      - `id` (uuid, primary key)
      - `ipfs_hash` (text, not null)
      - `metadata` (jsonb, default '{}')
      - `submitter_address` (text, not null)
      - `transaction_hash` (text, not null)
      - `created_at` (timestamptz, default now())
    - `case_records`
      - `id` (uuid, primary key)
      - `case_number` (text, unique, not null)
      - `title` (text, not null)
      - `description` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public read and insert access

  3. Performance
    - Add indexes for commonly queried columns
*/

-- Create evidence_records table
CREATE TABLE IF NOT EXISTS evidence_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ipfs_hash text NOT NULL,
    metadata jsonb NOT NULL DEFAULT '{}',
    submitter_address text NOT NULL,
    transaction_hash text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create case_records table
CREATE TABLE IF NOT EXISTS case_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number text UNIQUE NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE evidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
    -- Drop and recreate evidence_records policies
    DROP POLICY IF EXISTS "Allow public read access to evidence_records" ON evidence_records;
    DROP POLICY IF EXISTS "Allow public insert to evidence_records" ON evidence_records;
    
    -- Drop and recreate case_records policies
    DROP POLICY IF EXISTS "Allow public read access to case_records" ON case_records;
    DROP POLICY IF EXISTS "Allow public insert to case_records" ON case_records;
END $$;

-- Create policies for evidence_records
CREATE POLICY "Allow public read access to evidence_records"
    ON evidence_records
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert to evidence_records"
    ON evidence_records
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policies for case_records
CREATE POLICY "Allow public read access to case_records"
    ON case_records
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert to case_records"
    ON case_records
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_evidence_created_at ON evidence_records(created_at);
CREATE INDEX IF NOT EXISTS idx_evidence_submitter ON evidence_records(submitter_address);
CREATE INDEX IF NOT EXISTS idx_case_number ON case_records(case_number);