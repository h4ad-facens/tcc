// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./DisputeBase.sol";
import "./IDisputeCore.sol";
import "./DisputeProposal.sol";
import "./DisputeBid.sol";

contract DisputeCore is IDisputeCore, DisputeProposal, DisputeBid, DisputeBase {
    constructor(address proposalContractAddress, address bidContractAddress)
        DisputeProposal(proposalContractAddress)
        DisputeBid(bidContractAddress)
    {}

    /// @dev O endereço do mediador selecionado por cada usuário pela identificação da disputa
    mapping(uint256 => mapping(address => address)) internal _pendingSelectedMediatorByUserAndDisputeId;

    /// @dev O endereço do mediador selecionado para uma disputa
    mapping(uint256 => address) internal _selectedMediatorByDisputeId;

    function createDispute(uint256 proposalId) external returns (uint256) {
        bytes32 proposalStatus;
        address proposalCreator;

        (proposalStatus, proposalCreator) = _getStatusAndProposalCreator(proposalId);

        if (proposalStatus != IN_DEVELOPMENT) revert InvalidStatusToCreateDispute(proposalStatus);

        uint256 bidId = _getSelectedBidIdByProposalId(proposalId);
        address bidder = _getBidderAddressByBidId(bidId);

        if (bidder != _msgSender() && proposalCreator != _msgSender()) revert YouAreNotTheBidderOrProposalCreator();

        uint256 newDisputeId = _createDispute(proposalId, proposalCreator, bidder);

        _nextDisputeStatus(proposalId, IN_DISPUTE);

        return newDisputeId;
    }

    function getSelectedMediatorForDisputeId(uint256 disputeId) external view returns (address) {
        address selectedMediator = _selectedMediatorByDisputeId[disputeId];

        if (selectedMediator == address(0)) revert MediatorNotSelected();

        return selectedMediator;
    }

    function selectMediator(uint256 disputeId, address mediator) external disputeExist(disputeId) {
        if (_selectedMediatorByDisputeId[disputeId] != address(0))
            revert MediatorAlreadySelected(_selectedMediatorByDisputeId[disputeId]);

        Dispute storage dispute = _disputes[disputeId];

        if (dispute.bidderAddress != _msgSender() && dispute.proposalCreatorAddress != _msgSender())
            revert YouAreNotTheBidderOrProposalCreator();

        _pendingSelectedMediatorByUserAndDisputeId[disputeId][_msgSender()] = mediator;

        address otherAddressToLook = _msgSender() == dispute.bidderAddress
            ? dispute.proposalCreatorAddress
            : dispute.bidderAddress;

        if (_pendingSelectedMediatorByUserAndDisputeId[disputeId][otherAddressToLook] == mediator)
            _nextDisputeStatus(dispute.proposalId, IN_DISPUTE_DISTRIBUTION);
    }
}
