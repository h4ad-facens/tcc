// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

interface IProposalBase {
    error ProposalNotFound();

    /// @dev As informações de uma proposta
    struct Proposal {
        string name;
        string description;
        string category;
        string contactInfo;
        address creator;
        uint256 amount;
        bytes32 status;
        uint64 createdAt;
    }

    function getProposalById(uint256 proposalId)
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory category,
            string memory contactInfo,
            address creator,
            uint256 amount,
            bytes32 status,
            uint64 createdAt
        );

    function getStatusOfProposal(uint256 proposalId) external view returns (bytes32);

    function getCountOfProposalsByUser(address userAddress) external view returns (uint256);

    function getProposalIdByIndexByUser(address userAddress, uint256 index) external view returns (uint256);

    function getCountOfProposals() external view returns (uint256);
}
