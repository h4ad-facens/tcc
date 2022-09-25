// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./IProposalBase.sol";

interface IProposalCore is IProposalBase {
    error AmountTooLow();
    error InvalidStatusToCancel(bytes32 currentStatus);
    error InvalidStatusToUpdate(bytes32 currentStatus);
    error YouAreNotTheCreator();

    error InvalidStatusToSelectBidder(bytes32 currentStatus);
    error InvalidStatusToFinish(bytes32 currentStatus);

    function createProposal(
        string memory name,
        string memory description,
        string memory category,
        string memory contactInfo
    ) external payable returns (uint256);

    function cancelProposal(uint256 proposalId) external;

    function onBidderSelected(uint256 proposalId) external;

    function nextDisputeStatus(uint256 proposalId, bytes32 status) external;

    function finishProposal(uint256 proposalId, address bidderAddress) external;
}
