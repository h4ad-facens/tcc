// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./IDisputeBase.sol";

interface IDisputeCore is IDisputeBase {
    error YouAreNotTheMediator(address currentMediator);
    error DisputeAlreadyDistributted(uint64 distributedAt);
    error InvalidAmountOfShare();

    function createDispute(uint256 proposalId) external returns (uint256);

    function selectMediator(uint256 disputeId, address mediatorAddress) external;

    function selectDistribuition(uint256 disputeId, uint8 splitBidderShare) external;
}
