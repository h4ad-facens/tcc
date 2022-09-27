// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "../proposals/IProposalCore.sol";

abstract contract DisputeProposal {
    constructor(address proposalContractAddress) {
        proposalBaseContract = IProposalCore(proposalContractAddress);
    }

    /// @dev A referência para o contrato de propostas
    IProposalCore private proposalBaseContract;

    function _getStatusAndProposalCreator(uint256 proposalId)
        internal
        view
        returns (bytes32 status, address proposalCreator)
    {
        (, , , , proposalCreator, , status, ) = proposalBaseContract.getProposalById(proposalId);
    }

    function _onCreateDispute(uint256 proposalId) internal {
        proposalBaseContract.onCreateDispute(proposalId);
    }

    function _onMediatorSelected(uint256 proposalId) internal {
        proposalBaseContract.onMediatorSelected(proposalId);
    }

    function _onSelectDistribution(
        uint256 proposalId,
        uint256 bidId,
        address bidder,
        uint8 splitBidderShare
    ) internal {
        proposalBaseContract.onSelectDistribution(proposalId, bidId, bidder, splitBidderShare);
    }
}
