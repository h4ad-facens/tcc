// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

abstract contract ProposalStatus {
    bytes32 public constant WAITING_BID = keccak256("WAITING_BID");
    bytes32 public constant IN_DEVELOPMENT = keccak256("IN_DEVELOPMENT");
    bytes32 public constant CANCELLED = keccak256("CANCELLED");
    bytes32 public constant IN_DISPUTE = keccak256("IN_DISPUTE");
    bytes32 public constant IN_DISPUTE_DISTRIBUTION = keccak256("IN_DISPUTE_DISTRIBUTION");
    bytes32 public constant FINISHED = keccak256("FINISHED");

    event StatusChanged(uint256 indexed proposalId, bytes32 oldStatus, bytes32 newStatus);
}
