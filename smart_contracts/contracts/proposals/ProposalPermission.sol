// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./IProposalPermission.sol";
import "./ProposalBase.sol";

abstract contract ProposalPermission is IProposalPermission, ProposalBase {
    address private bidContractAddress;
    address private disputeContractAddress;

    function setBidContractAddress(address contractAddress) external onlyOwner {
        if (contractAddress == address(0)) revert InvalidAddress();

        address oldAddress = bidContractAddress;
        bidContractAddress = contractAddress;

        emit OnChangeBidAddress(oldAddress, contractAddress);
    }

    function setDisputeContractAddress(address contractAddress) external onlyOwner {
        if (contractAddress == address(0)) revert InvalidAddress();

        address oldAddress = disputeContractAddress;
        disputeContractAddress = contractAddress;

        emit OnChangeBidAddress(oldAddress, contractAddress);
    }

    modifier onlyAllowedContract() {
        address sender = _msgSender();

        if (sender == address(0) || !(sender == bidContractAddress || sender == disputeContractAddress))
            revert ForbiddenAccessToMethod();

        _;
    }
}
