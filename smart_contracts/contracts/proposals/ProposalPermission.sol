// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "../bids/IBidCore.sol";
import "./IProposalPermission.sol";
import "./ProposalBase.sol";

abstract contract ProposalPermission is IProposalPermission, ProposalBase {
    address private bidContractAddress;
    address private disputeContractAddress;

    IBidCore private bidCoreContract;

    function setBidContractAddress(address contractAddress) external onlyOwner {
        if (contractAddress == address(0)) revert InvalidAddress();

        address oldAddress = bidContractAddress;
        bidContractAddress = contractAddress;

        bidCoreContract = IBidCore(bidContractAddress);

        emit OnChangeBidAddress(oldAddress, bidContractAddress);
    }

    function setDisputeContractAddress(address contractAddress) external onlyOwner {
        if (contractAddress == address(0)) revert InvalidAddress();

        address oldAddress = disputeContractAddress;
        disputeContractAddress = contractAddress;

        emit OnChangeBidAddress(oldAddress, disputeContractAddress);
    }

    function _onSelectDistribution(uint256 bidId) internal {
        bidCoreContract.onSelectDistribution(bidId);
    }

    modifier onlyAllowedBidContract() {
        address sender = _msgSender();

        if (sender != bidContractAddress) revert ForbiddenAccessToMethod();

        _;
    }

    modifier onlyAllowedDisputeContract() {
        address sender = _msgSender();

        if (sender != disputeContractAddress) revert ForbiddenAccessToMethod();

        _;
    }
}
