// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./IBidBase.sol";
import "../proposals/IProposalCore.sol";
import "../common/ProposalStatus.sol";
import "../common/EnumerateIdByAddress.sol";
import "../common/EnumerateIdByUint256.sol";

abstract contract BidProposal {
    error ForbiddenAccessToMethod(address proposalContract);

    constructor(address proposalContractAddress) {
        proposalContract = proposalContractAddress;

        proposalCoreContract = IProposalCore(proposalContract);
    }

    /// @dev A taxa básica para pagar para participar de um lance de uma proposta
    uint32 public constant BID_SHARE_TO_PARTICIPATE = 20; // igual a 5%

    /// @dev A referência para o contrato de propostas
    IProposalCore private proposalCoreContract;

    /// @dev O endereço do contrato de proposta
    address proposalContract;

    modifier onlyAllowedProposalContract() {
        address sender = msg.sender;

        if (sender != proposalContract) revert ForbiddenAccessToMethod(proposalContract);

        _;
    }

    function _getStatusAndAmountToPayForBidByProposalId(uint256 proposalId)
        internal
        view
        returns (bytes32 status, uint256 amountToPayForBid)
    {
        uint256 amount;

        (, , , , , amount, status, ) = proposalCoreContract.getProposalById(proposalId);

        amountToPayForBid = Math.ceilDiv(amount, BID_SHARE_TO_PARTICIPATE);
    }

    function _getStatusAndProposalCreator(uint256 proposalId)
        internal
        view
        returns (bytes32 status, address proposalCreator)
    {
        (, , , , proposalCreator, , status, ) = proposalCoreContract.getProposalById(proposalId);
    }

    function _onBidderSelected(uint256 proposalId) internal {
        proposalCoreContract.onBidderSelected(proposalId);
    }

    function _onPaymentTransfered(uint256 proposalId, address bidderAddress) internal {
        proposalCoreContract.onPaymentTransferred(proposalId, bidderAddress);
    }
}
