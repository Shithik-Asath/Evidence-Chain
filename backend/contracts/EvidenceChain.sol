// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceChain {
    struct Evidence {
        string ipfsHash;
        string metadata;
        address submitter;
        uint256 timestamp;
    }

    mapping(bytes32 => Evidence) public evidenceRecords;
    event EvidenceSubmitted(bytes32 indexed id, string ipfsHash, address submitter);

    function submitEvidence(string memory _ipfsHash, string memory _metadata) public returns (bytes32) {
        bytes32 evidenceId = keccak256(abi.encodePacked(_ipfsHash, msg.sender, block.timestamp));
        
        evidenceRecords[evidenceId] = Evidence({
            ipfsHash: _ipfsHash,
            metadata: _metadata,
            submitter: msg.sender,
            timestamp: block.timestamp
        });

        emit EvidenceSubmitted(evidenceId, _ipfsHash, msg.sender);
        return evidenceId;
    }

    function getEvidence(bytes32 _id) public view returns (string memory, string memory, address, uint256) {
        Evidence memory evidence = evidenceRecords[_id];
        return (
            evidence.ipfsHash,
            evidence.metadata,
            evidence.submitter,
            evidence.timestamp
        );
    }
}