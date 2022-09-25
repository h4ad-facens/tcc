// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IBidBase.sol";
import "./BidProposal.sol";
import "../common/ProposalStatus.sol";
import "../common/EnumerateIdByAddress.sol";
import "../common/EnumerateIdByUint256.sol";

abstract contract BidBase is
    IBidBase,
    BidProposal,
    ProposalStatus,
    EnumerateIdByUint256,
    EnumerateIdByAddress,
    Ownable
{
    /// @dev Uma estrutura usada para auxiliar a contagem dos lances
    using Counters for Counters.Counter;

    /// @dev A contagem da quantidade de lances criadas
    Counters.Counter private _bidIds;

    /// @dev O evento lançado quando um lance é criado
    event Created(uint256 id, uint256 indexed proposalId, address indexed bidderAddress);

    /// @dev O evento lançado quando um lance é selecionado pelo criador
    event Selected(uint256 id, uint256 indexed proposalId, address indexed bidderAddress);

    /// @dev O evento lançado quando um lance é cancelado
    event Cancelled(uint256 id, uint256 indexed proposalId, address indexed bidderAddress);

    /// @dev O modificador usado para garantir a execução de um método apenas se o lance existir
    modifier bidExist(uint256 bidId) {
        if (bidId > _bidIds.current()) revert BidNotFound();

        _;
    }

    /// @dev A lista com os lances já criados
    mapping(uint256 => Bid) internal _bids;

    /// @dev A lista de lances selecionados por proposta
    mapping(uint256 => uint256) internal _selectedBidIdByProposalId;

    function getBidById(uint256 bidId)
        external
        view
        override
        bidExist(bidId)
        returns (
            uint256 proposalId,
            address bidderAddress,
            bool isCancelled,
            uint256 bidPaidAmount,
            uint64 createdAt
        )
    {
        Bid memory bid = _bids[bidId];

        proposalId = bid.proposalId;
        bidderAddress = bid.bidderAddress;
        isCancelled = bid.isCancelled;
        bidPaidAmount = bid.bidPaidAmount;
        createdAt = bid.createdAt;
    }

    function getCountOfBids() external view returns (uint256) {
        return _bidIds.current();
    }

    function getCountOfBidsByProposalId(uint256 proposalId) external view returns (uint256) {
        return _getCountByUint256(proposalId);
    }

    function getBidIdByProposalIdAndIndex(uint256 proposalId, uint256 index) external view returns (uint256) {
        return _getIdByUint256AndIndex(proposalId, index);
    }

    function getCountOfBidsByUser(address userAddress) external view returns (uint256) {
        return _getCountByAddress(userAddress);
    }

    function getBidIdByUserAndIndex(address userAddress, uint256 index) external view returns (uint256) {
        return _getIdByAddressAndIndex(userAddress, index);
    }

    function getSelectedBidIdByProposalId(uint256 proposalId) external view returns (uint256) {
        uint256 selectedBidId = _selectedBidIdByProposalId[proposalId];

        if (selectedBidId == 0) revert NoBidSelectedForProposal();

        return selectedBidId;
    }

    function _createBid(
        uint256 proposalId,
        address bidderAddress,
        uint256 bidPaidAmount
    ) internal returns (uint256) {
        uint256 amountToPayForBid;
        bytes32 proposalStatus;

        (proposalStatus, amountToPayForBid) = _getStatusAndAmountToPayForBidByProposalId(proposalId);

        if (proposalStatus != WAITING_BID) revert InvalidStatusToCreateBid(proposalStatus);

        if (amountToPayForBid != bidPaidAmount) revert InvalidPaymentToCreateBid(amountToPayForBid);

        _bidIds.increment();

        uint256 newBidId = _bidIds.current();

        Bid memory bid = Bid(proposalId, bidderAddress, false, bidPaidAmount, uint64(block.timestamp));

        _bids[newBidId] = bid;

        _addIdToAddress(newBidId, _msgSender());
        _addIdToUint256(newBidId, proposalId);

        emit Created(newBidId, proposalId, bidderAddress);

        return newBidId;
    }

    function _selectBid(uint256 proposalId, uint256 bidId) internal bidExist(bidId) {
        if (_selectedBidIdByProposalId[proposalId] != 0)
            revert ProposalAlreadySelectedBid(_selectedBidIdByProposalId[proposalId]);

        Bid memory bid = _bids[bidId];

        if (bid.isCancelled) revert CannotSelectCancelledBid();

        bytes32 proposalStatus;
        address proposalCreator;

        (proposalStatus, proposalCreator) = _getStatusAndProposalCreator(proposalId);

        if (proposalStatus != WAITING_BID) revert InvalidStatusToSelectBid(proposalStatus);

        if (_msgSender() != proposalCreator) revert YouAreNotTheProposalCreator(proposalCreator);

        _selectedBidIdByProposalId[proposalId] = bidId;

        _onBidderSelected(proposalId);

        emit Selected(bidId, proposalId, bid.bidderAddress);
    }

    function _cancelBid(uint256 proposalId, uint256 bidId)
        internal
        bidExist(bidId)
        returns (address refundAddress, uint256 refundAmount)
    {
        Bid storage bid = _bids[bidId];

        if (bid.isCancelled) revert BidAlreadyCancelled();

        if (bid.bidderAddress != _msgSender()) revert YouAreNotTheBidCreator(bid.bidderAddress);

        if (bid.proposalId != proposalId) revert BidNotBelongsToProposal(bid.proposalId);

        uint256 selectedBidForProposal = _selectedBidIdByProposalId[proposalId];

        if (selectedBidForProposal != 0) revert CannotCancelBidWhenSelected();

        bid.isCancelled = true;

        refundAddress = bid.bidderAddress;
        refundAmount = bid.bidPaidAmount;
    }
}
