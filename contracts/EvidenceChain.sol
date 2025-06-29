// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceChain {
    struct Evidence {
        string ipfsHash;
        string metadata;
        address submitter;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => Evidence) public evidenceRecords;
    bytes32[] public evidenceIds;
    
    event EvidenceSubmitted(
        bytes32 indexed id, 
        string ipfsHash, 
        address indexed submitter,
        uint256 timestamp
    );

    function submitEvidence(
        string memory _ipfsHash, 
        string memory _metadata
    ) public returns (bytes32) {
        bytes32 evidenceId = keccak256(
            abi.encodePacked(_ipfsHash, msg.sender, block.timestamp)
        );
        
        require(!evidenceRecords[evidenceId].exists, "Evidence already exists");
        
        evidenceRecords[evidenceId] = Evidence({
            ipfsHash: _ipfsHash,
            metadata: _metadata,
            submitter: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        evidenceIds.push(evidenceId);
        
        emit EvidenceSubmitted(evidenceId, _ipfsHash, msg.sender, block.timestamp);
        return evidenceId;
    }

    function getEvidence(bytes32 _id) public view returns (
        string memory ipfsHash,
        string memory metadata,
        address submitter,
        uint256 timestamp
    ) {
        require(evidenceRecords[_id].exists, "Evidence does not exist");
        Evidence memory evidence = evidenceRecords[_id];
        return (
            evidence.ipfsHash,
            evidence.metadata,
            evidence.submitter,
            evidence.timestamp
        );
    }

    function getAllEvidenceIds() public view returns (bytes32[] memory) {
        return evidenceIds;
    }

    function getEvidenceCount() public view returns (uint256) {
        return evidenceIds.length;
    }
}