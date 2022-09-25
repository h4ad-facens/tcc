// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "./IBidCore.sol";
import "./BidBase.sol";

contract BidCore is IBidCore, BidBase {
    constructor(address proposalContractAddress) BidProposal(proposalContractAddress) {}

    receive() external payable {}

    function createBid(uint256 proposalId) external payable {
        _createBid(proposalId, _msgSender(), msg.value);
    }

    function selectBid(uint256 proposalId, uint256 bidId) external {
        _selectBid(proposalId, bidId);
    }

    function cancelBid(uint256 proposalId, uint256 bidId) external {
        _cancelBid(proposalId, bidId);
    }

    function transferPayment(uint256 proposalId) external {
        bytes32 proposalStatus;
        address proposalCreator;

        (proposalStatus, proposalCreator) = _getStatusAndProposalCreator(proposalId);

        if (proposalStatus != IN_DEVELOPMENT) revert InvalidStatusToTransferProposal(proposalStatus);

        if (_msgSender() != proposalCreator) revert YouAreNotTheProposalCreator(proposalCreator);

        uint256 selectedBid = _selectedBidIdByProposalId[proposalId];
        Bid memory bid = _bids[selectedBid];

        _finishProposal(proposalId, bid.bidderAddress);

        // devolve o valor pago no lance
        Address.sendValue(payable(bid.bidderAddress), bid.bidPaidAmount);
    }
}
