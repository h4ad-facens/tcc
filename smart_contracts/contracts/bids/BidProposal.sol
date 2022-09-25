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
    constructor(address proposalContractAddress) {
        proposalBaseContract = IProposalCore(proposalContractAddress);
    }

    /// @dev A taxa básica para pagar para participar de um lance de uma proposta
    uint32 public constant BID_SHARE_TO_PARTICIPATE = 20; // igual a 5%

    /// @dev A referência para o contrato de propostas
    IProposalCore private proposalBaseContract;

    function _getStatusAndAmountToPayForBidByProposalId(uint256 proposalId)
        internal
        view
        returns (bytes32 status, uint256 amountToPayForBid)
    {
        uint256 amount;

        (, , , , , amount, status, ) = proposalBaseContract.getProposalById(proposalId);

        amountToPayForBid = Math.ceilDiv(amount, BID_SHARE_TO_PARTICIPATE);
    }

    function _getStatusAndProposalCreator(uint256 proposalId)
        internal
        view
        returns (bytes32 status, address proposalCreator)
    {
        (, , , , proposalCreator, , status, ) = proposalBaseContract.getProposalById(proposalId);
    }

    function _onBidderSelected(uint256 proposalId) internal {
        proposalBaseContract.onBidderSelected(proposalId);
    }

    function _finishProposal(uint256 proposalId, address bidderAddress) internal {
        proposalBaseContract.finishProposal(proposalId, bidderAddress);
    }
}
