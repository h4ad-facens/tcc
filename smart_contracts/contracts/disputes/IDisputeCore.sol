// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./IDisputeBase.sol";

interface IDisputeCore is IDisputeBase {
    function createDispute(uint256 proposalId) external returns (uint256);

    // function selectMediator(uint256 disputeId, address mediatorAddress) external;

    // function setDistribuition(uint256 disputeId, uint8 splitBidderShare) external;
}
