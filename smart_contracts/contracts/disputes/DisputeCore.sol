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

    function createDispute(uint256 proposalId) external returns (uint256) {
        if (_selectedDisputeIdByProposalId[proposalId] != 0) revert DisputeAlreadyExist();

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

    function getPendingSelectedMediatorByUserAddressAndDisputeId(address userAddress, uint256 disputeId)
        external
        view
        disputeExist(disputeId)
        returns (address)
    {
        address selectedMediator = _pendingSelectedMediatorByUserAndDisputeId[disputeId][userAddress];

        return selectedMediator;
    }

    function selectMediator(uint256 disputeId, address mediator) external disputeExist(disputeId) {
        Dispute storage dispute = _disputes[disputeId];

        if (dispute.mediatorAddress != address(0)) revert MediatorAlreadySelected(dispute.mediatorAddress);

        address caller = _msgSender();

        if (dispute.bidderAddress != caller && dispute.proposalCreatorAddress != caller)
            revert YouAreNotTheBidderOrProposalCreator();

        _pendingSelectedMediatorByUserAndDisputeId[disputeId][caller] = mediator;

        address otherAddressToLook = caller == dispute.bidderAddress
            ? dispute.proposalCreatorAddress
            : dispute.bidderAddress;

        if (_pendingSelectedMediatorByUserAndDisputeId[disputeId][otherAddressToLook] == mediator) {
            dispute.mediatorAddress = mediator;

            _onMediatorSelected(dispute.proposalId);
        }
    }

    function selectDistribution(uint256 disputeId, uint8 splitBidderShare) external disputeExist(disputeId) {
        Dispute storage dispute = _disputes[disputeId];

        if (dispute.mediatorAddress != _msgSender()) revert YouAreNotTheMediator(dispute.mediatorAddress);

        if (splitBidderShare > 100) revert InvalidAmountOfShare();

        if (dispute.distributedAt > 0) revert DisputeAlreadyDistributed(dispute.distributedAt);

        dispute.distributedAt = uint64(block.timestamp);
        dispute.splitBidderShare = splitBidderShare;

        _onSelectDistribution(dispute.proposalId, dispute.bidId, dispute.bidderAddress, splitBidderShare);
    }
}
