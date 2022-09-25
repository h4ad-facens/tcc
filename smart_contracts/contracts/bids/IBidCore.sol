// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./IBidBase.sol";

interface IBidCore is IBidBase {
    function createBid(uint256 proposalId) external payable;

    function selectBid(uint256 proposalId, uint256 bidId) external;

    function cancelBid(uint256 proposalId, uint256 bidId) external;

    function transferPayment(uint256 proposalId) external;
}
