// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IProposalBase.sol";
import "../common/ProposalStatus.sol";
import "../common/EnumerateIdByAddress.sol";

abstract contract ProposalBase is IProposalBase, ProposalStatus, EnumerateIdByAddress, Ownable {
    /// @dev Uma estrutura usada para auxiliar a contagem das propostas
    using Counters for Counters.Counter;

    /// @dev A contagem da quantidade de propostas criadas
    Counters.Counter private _proposalIds;

    /// @dev O evento lançado quando uma proposta é criada
    event Created(uint256 id, string indexed category, uint256 indexed amount);

    /// @dev O evento lançado quando o status muda
    event StatusChanged(uint256 indexed proposalId, bytes32 oldStatus, bytes32 newStatus);

    /// @dev O modificador usado para garantir a execução de um método apenas se a proposta existir
    modifier proposalExist(uint256 proposalId) {
        if (proposalId > _proposalIds.current()) revert ProposalNotFound();

        _;
    }

    /// @dev A lista com os propostas já criadas
    mapping(uint256 => Proposal) internal _proposals;

    function getProposalById(uint256 proposalId)
        external
        view
        override
        proposalExist(proposalId)
        returns (
            string memory name,
            string memory description,
            string memory category,
            string memory contactInfo,
            address creator,
            uint256 amount,
            bytes32 status,
            uint64 createdAt
        )
    {
        Proposal storage proposal = _proposals[proposalId];

        name = proposal.name;
        description = proposal.description;
        category = proposal.category;
        contactInfo = proposal.contactInfo;
        creator = proposal.creator;
        status = proposal.status;
        amount = proposal.amount;
        createdAt = proposal.createdAt;
    }

    function getStatusOfProposal(uint256 proposalId)
        external
        view
        override
        proposalExist(proposalId)
        returns (bytes32)
    {
        return _proposals[proposalId].status;
    }

    function getCountOfProposals() external view override returns (uint256) {
        return _proposalIds.current();
    }

    function getCountOfProposalsByUser(address userAddress) external view returns (uint256) {
        return _getCountByAddress(userAddress);
    }

    function getProposalIdByIndexByUser(address userAddress, uint256 index) external view returns (uint256) {
        return _getIdByAddressAndIndex(userAddress, index);
    }

    function _createProposal(
        string memory name,
        string memory description,
        string memory category,
        string memory contactInfo,
        address creator,
        uint256 amount,
        bytes32 status
    ) internal returns (uint256) {
        _proposalIds.increment();

        uint256 newProposalId = _proposalIds.current();

        Proposal memory proposal = Proposal(
            name,
            description,
            category,
            contactInfo,
            creator,
            amount,
            status,
            uint64(block.timestamp)
        );

        _proposals[newProposalId] = proposal;
        _addIdToAddress(newProposalId, _msgSender());

        emit Created(newProposalId, category, amount);

        return newProposalId;
    }

    function _updateProposalStatus(uint256 proposalId, bytes32 status) internal {
        Proposal storage proposal = _proposals[proposalId];
        bytes32 oldStatus = proposal.status;

        proposal.status = status;

        emit StatusChanged(proposalId, oldStatus, status);
    }
}
