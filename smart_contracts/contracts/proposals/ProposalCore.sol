// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IProposalCore.sol";
import "./ProposalPermission.sol";

contract ProposalCore is IProposalCore, ProposalPermission {
    receive() external payable {}

    uint256 public constant SHARE_FOR_MEDIATOR = 5;

    function createProposal(
        string memory name,
        string memory description,
        string memory category,
        string memory contactInfo
    ) external payable returns (uint256) {
        if (msg.value <= 0) revert AmountTooLow();

        uint256 proposalId = _createProposal(
            name,
            description,
            category,
            contactInfo,
            _msgSender(),
            msg.value,
            WAITING_BID
        );

        /// armazena a quantia do deposito do pagamento da proposta no contrato
        Address.sendValue(payable(address(this)), msg.value);

        return proposalId;
    }

    function cancelProposal(uint256 proposalId) external proposalExist(proposalId) {
        Proposal memory proposal = _proposals[proposalId];

        if (proposal.creator != _msgSender()) revert YouAreNotTheCreator();

        if (proposal.status != WAITING_BID) revert InvalidProposalStatus(proposal.status);

        _updateProposalStatus(proposalId, CANCELLED);

        /// devolve o dinheiro que foi depositado pelo criador da proposta
        Address.sendValue(payable(proposal.creator), proposal.amount);
    }

    function onBidderSelected(uint256 proposalId) external proposalExist(proposalId) onlyAllowedBidContract {
        Proposal memory proposal = _proposals[proposalId];

        if (proposal.status != WAITING_BID) {
            revert InvalidProposalStatus(proposal.status);
        }

        _updateProposalStatus(proposalId, IN_DEVELOPMENT);
    }

    function onPaymentTransferred(uint256 proposalId, address bidderAddress)
        external
        proposalExist(proposalId)
        onlyAllowedBidContract
    {
        Proposal memory proposal = _proposals[proposalId];

        if (proposal.status != IN_DEVELOPMENT) revert InvalidProposalStatus(proposal.status);

        _updateProposalStatus(proposalId, FINISHED);

        /// transfere o valor da proposta para o recebedor
        Address.sendValue(payable(bidderAddress), proposal.amount);
    }

    function onCreateDispute(uint256 proposalId) external proposalExist(proposalId) onlyAllowedDisputeContract {
        Proposal memory proposal = _proposals[proposalId];

        if (proposal.status != IN_DEVELOPMENT) revert InvalidProposalStatus(proposal.status);

        _updateProposalStatus(proposalId, IN_DISPUTE);
    }

    function onMediatorSelected(uint256 proposalId) external proposalExist(proposalId) onlyAllowedDisputeContract {
        Proposal memory proposal = _proposals[proposalId];

        if (proposal.status != IN_DISPUTE) revert InvalidProposalStatus(proposal.status);

        _updateProposalStatus(proposalId, IN_DISPUTE_DISTRIBUTION);
    }

    function onSelectDistribution(
        address mediatorAddress,
        uint256 proposalId,
        uint256 bidId,
        address bidderAddress,
        uint8 splitBidderShare
    ) external proposalExist(proposalId) onlyAllowedDisputeContract {
        if (splitBidderShare > 100) revert InvalidSplitBidderShare();

        Proposal memory proposal = _proposals[proposalId];

        if (proposal.status != IN_DISPUTE_DISTRIBUTION) revert InvalidProposalStatus(proposal.status);

        _updateProposalStatus(proposalId, FINISHED);

        uint256 amount = proposal.amount;
        uint256 amountToMediator = Math.mulDiv(amount, SHARE_FOR_MEDIATOR, 100, Math.Rounding.Zero);
        uint256 restToSplit = amount - amountToMediator;

        Address.sendValue(payable(mediatorAddress), amountToMediator);

        if (splitBidderShare > 0) {
            uint256 bidderAmountToPay = Math.mulDiv(restToSplit, splitBidderShare, 100, Math.Rounding.Zero);

            if (bidderAmountToPay > 0) {
                /// transfere o valor da proposta para o recebedor
                Address.sendValue(payable(bidderAddress), bidderAmountToPay);
            }
        }

        uint8 splitProposalCreatorShare = 100 - splitBidderShare;

        if (splitProposalCreatorShare > 0) {
            uint256 proposalCreatorAmountToPay = Math.mulDiv(
                restToSplit,
                splitProposalCreatorShare,
                100,
                Math.Rounding.Zero
            );

            if (proposalCreatorAmountToPay > 0) {
                /// transfere o valor da proposta para o criador da proposta
                Address.sendValue(payable(proposal.creator), proposalCreatorAmountToPay);
            }
        }

        _onSelectDistribution(bidId);
    }
}
