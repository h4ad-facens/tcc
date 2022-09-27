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

    function _nextDisputeStatus(uint256 proposalId, bytes32 status) internal {
        proposalBaseContract.nextDisputeStatus(proposalId, status);
    }
}
