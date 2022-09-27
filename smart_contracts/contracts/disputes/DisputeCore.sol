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
        address caller = _msgSender();

        if (bidder != caller && proposalCreator != caller) revert YouAreNotTheBidderOrProposalCreator();

        uint256 newDisputeId = _createDispute(proposalId, bidId, proposalCreator, bidder);

        _onCreateDispute(proposalId);

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

        address caller = _msgSender();

        Dispute storage dispute = _disputes[disputeId];

        if (dispute.bidderAddress != caller && dispute.proposalCreatorAddress != caller)
            revert YouAreNotTheBidderOrProposalCreator();

        _pendingSelectedMediatorByUserAndDisputeId[disputeId][caller] = mediator;

        address otherAddressToLook = caller == dispute.bidderAddress
            ? dispute.proposalCreatorAddress
            : dispute.bidderAddress;

        if (_pendingSelectedMediatorByUserAndDisputeId[disputeId][otherAddressToLook] == mediator) {
            _selectedMediatorByDisputeId[disputeId] = mediator;

            _onMediatorSelected(dispute.proposalId);
        }
    }

    function selectDistribuition(uint256 disputeId, uint8 splitBidderShare) external disputeExist(disputeId) {
        if (_selectedMediatorByDisputeId[disputeId] != _msgSender())
            revert YouAreNotTheMediator(_selectedMediatorByDisputeId[disputeId]);

        if (splitBidderShare > 100) revert InvalidAmountOfShare();

        Dispute storage dispute = _disputes[disputeId];

        if (dispute.distributedAt > 0) revert DisputeAlreadyDistributted(dispute.distributedAt);

        dispute.distributedAt = uint64(block.timestamp);
        dispute.splitBidderShare = splitBidderShare;

        _onSelectDistribution(dispute.proposalId, dispute.bidId, dispute.bidderAddress, splitBidderShare);
    }
}
