// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "./IProposalCore.sol";
import "./ProposalPermission.sol";

contract ProposalCore is IProposalCore, ProposalPermission {
    receive() external payable {}

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

        if (proposal.status != WAITING_BID) revert InvalidStatusToCancel(proposal.status);

        _updateProposalStatus(proposalId, CANCELLED);

        /// devolve o dinheiro que foi depositado pelo criador da proposta
        Address.sendValue(payable(proposal.creator), proposal.amount);
    }

    function onBidderSelected(uint256 proposalId) external proposalExist(proposalId) onlyAllowedContract {
        Proposal memory proposal = _proposals[proposalId];

        if (proposal.status != WAITING_BID) {
            revert InvalidStatusToSelectBidder(proposal.status);
        }

        _updateProposalStatus(proposalId, IN_DEVELOPMENT);
    }

    function nextDisputeStatus(uint256 proposalId, bytes32 status)
        external
        proposalExist(proposalId)
        onlyAllowedContract
    {
        Proposal memory proposal = _proposals[proposalId];

        if (proposal.status == IN_DEVELOPMENT && status == IN_DISPUTE) {
            _updateProposalStatus(proposalId, status);
        } else if (proposal.status == IN_DISPUTE && status == IN_DISPUTE_DISTRIBUTION) {
            _updateProposalStatus(proposalId, status);
        } else {
            revert InvalidStatusToUpdate(proposal.status);
        }
    }

    function finishProposal(uint256 proposalId, address bidderAddress)
        external
        proposalExist(proposalId)
        onlyAllowedContract
    {
        Proposal memory proposal = _proposals[proposalId];

        if (proposal.status == IN_DEVELOPMENT || proposal.status == IN_DISPUTE_DISTRIBUTION) {
            _updateProposalStatus(proposalId, FINISHED);

            /// transfere o valor da proposta para o recebedor
            Address.sendValue(payable(bidderAddress), proposal.amount);
        } else {
            revert InvalidStatusToFinish(proposal.status);
        }
    }
}
