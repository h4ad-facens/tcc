// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "../bids/IBidCore.sol";

abstract contract DisputeBid {
    constructor(address bidContractAddress) {
        bidBaseContract = IBidCore(bidContractAddress);
    }

    /// @dev A referência para o contrato de lances
    IBidCore private bidBaseContract;

    function _getSelectedBidIdByProposalId(uint256 proposalId) internal view returns (uint256) {
        return bidBaseContract.getSelectedBidIdByProposalId(proposalId);
    }

    function _getBidderAddressByBidId(uint256 bidId) internal view returns (address bidderAddress) {
        (, bidderAddress, , , ) = bidBaseContract.getBidById(bidId);
    }
}
