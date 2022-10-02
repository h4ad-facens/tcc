// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./IProposalBase.sol";

interface IProposalCore is IProposalBase {
    error AmountTooLow();
    error InvalidProposalStatus(bytes32 currentStatus);
    error YouAreNotTheCreator();
    error InvalidSplitBidderShare();

    function createProposal(
        string memory name,
        string memory description,
        string memory category,
        string memory contactInfo
    ) external payable returns (uint256);

    function cancelProposal(uint256 proposalId) external;

    function onBidderSelected(uint256 proposalId) external;

    function onPaymentTransferred(uint256 proposalId, address bidderAddress) external;

    function onCreateDispute(uint256 proposalId) external;

    function onMediatorSelected(uint256 proposalId) external;

    function onSelectDistribution(
        uint256 proposalId,
        uint256 bidId,
        address bidderAddress,
        uint8 splitBidderShare
    ) external;
}
