// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

interface IProposalCore {
    error AmountTooLow();
    error InvalidStatusToCancel(bytes32 currentStatus);
    error InvalidStatusToUpdate(bytes32 currentStatus);
    error YouAreNotTheCreator();

    function createProposal(
        string memory name,
        string memory description,
        string memory category,
        string memory contactInfo
    ) external payable returns (uint256);

    function cancelProposal(uint256 proposalId) external;

    function setProposalStatus(uint256 proposalId, bytes32 status) external;
}
