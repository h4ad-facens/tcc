// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IDisputeBase.sol";
import "../common/ProposalStatus.sol";
import "../common/EnumerateIdByAddress.sol";
import "../common/EnumerateIdByUint256.sol";

abstract contract DisputeBase is IDisputeBase, ProposalStatus, EnumerateIdByAddress, Ownable {
    /// @dev Uma estrutura usada para auxiliar a contagem dos disputas
    using Counters for Counters.Counter;

    /// @dev A contagem da quantidade de disputas criadas
    Counters.Counter private _disputeIds;

    /// @dev O evento lançado quando um lance é criado
    event Created(
        uint256 id,
        uint256 proposalId,
        address indexed proposalCreatorAddress,
        address indexed bidderAddress
    );

    /// @dev O evento lançado quando um mediador é selecionado pelo criador
    event MediatorSelected(uint256 id, address indexed mediatorAddress);

    /// @dev O evento lançado quando a distribuição for definida
    event DistribuitionDefined(uint256 id, uint256 indexed proposalId, address indexed bidderAddress);

    /// @dev O modificador usado para garantir a execução de um método apenas se o lance existir
    modifier disputeExist(uint256 disputeId) {
        if (disputeId > _disputeIds.current()) revert DisputeNotFound();

        _;
    }

    /// @dev A lista com as disputas já criadas
    mapping(uint256 => Dispute) internal _disputes;

    /// @dev A lista de disputas selecionadas por proposta
    mapping(uint256 => uint256) internal _selectedDisputeIdByProposalId;

    function getDisputeById(uint256 disputeId)
        external
        view
        override
        disputeExist(disputeId)
        returns (
            uint256 proposalId,
            uint64 createdAt,
            address proposalCreatorAddress,
            address bidderAddress,
            address mediatorAddress,
            uint8 splitBidderShare,
            bool createdByBidder
        )
    {
        Dispute memory dispute = _disputes[disputeId];

        proposalId = dispute.proposalId;
        createdAt = dispute.createdAt;
        proposalCreatorAddress = dispute.proposalCreatorAddress;
        bidderAddress = dispute.bidderAddress;
        mediatorAddress = dispute.mediatorAddress;
        splitBidderShare = dispute.splitBidderShare;
        createdByBidder = dispute.createdByBidder;
    }

    function getCountOfDisputes() external view returns (uint256) {
        return _disputeIds.current();
    }

    function getCountOfDisputesByUser(address userAddress) external view returns (uint256) {
        return _getCountByAddress(userAddress);
    }

    function getDisputeIdByUserAddressAndIndex(address userAddress, uint256 index) external view returns (uint256) {
        return _getIdByAddressAndIndex(userAddress, index);
    }

    function getDisputeIdByProposalId(uint256 proposalId) external view returns (uint256) {
        uint256 selectedDisputeId = _selectedDisputeIdByProposalId[proposalId];

        if (selectedDisputeId == 0) revert NoDisputeCreatedForProposal();

        return selectedDisputeId;
    }

    function _createDispute(
        uint256 proposalId,
        address proposalCreator,
        address bidder
    ) internal returns (uint256) {
        if (_selectedDisputeIdByProposalId[proposalId] != 0) revert DisputeAlreadyExist();

        _disputeIds.increment();

        uint256 newDisputeId = _disputeIds.current();

        Dispute memory dispute = Dispute(
            proposalId,
            uint64(block.timestamp),
            proposalCreator,
            bidder,
            address(0),
            0,
            bidder == _msgSender()
        );

        _disputes[newDisputeId] = dispute;
        _selectedDisputeIdByProposalId[proposalId] = newDisputeId;

        _addIdToAddress(newDisputeId, proposalCreator);
        _addIdToAddress(newDisputeId, bidder);

        return newDisputeId;
    }
}
