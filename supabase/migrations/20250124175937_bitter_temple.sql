-- Create evidence_records table
CREATE TABLE IF NOT EXISTS evidence_records (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ipfs_hash VARCHAR(255) NOT NULL,
    metadata JSON NOT NULL,
    submitter_address VARCHAR(255) NOT NULL,
    transaction_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create case_records table
CREATE TABLE IF NOT EXISTS case_records (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes
CREATE INDEX idx_evidence_created_at ON evidence_records(created_at);
CREATE INDEX idx_evidence_submitter ON evidence_records(submitter_address);
CREATE INDEX idx_case_number ON case_records(case_number);