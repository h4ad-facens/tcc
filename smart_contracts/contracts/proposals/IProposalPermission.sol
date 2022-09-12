// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

interface IProposalPermission {
    error InvalidAddress();
    error ForbiddenAccessToMethod();

    event OnChangeBidAddress(address oldAddress, address newAddress);
    event OnChangeDisputeAddress(address oldAddress, address newAddress);

    function setBidContractAddress(address contractAddress) external;

    function setDisputeContractAddress(address contractAddress) external;
}
