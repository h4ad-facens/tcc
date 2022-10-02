// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

interface IDisputeBase {
    error DisputeNotFound();
    error NoDisputeCreatedForProposal();

    error InvalidStatusToCreateDispute(bytes32 currentProposalStatus);

    error YouAreNotTheBidderOrProposalCreator();
    error MediatorAlreadySelected(address selectedMediator);

    error MediatorNotSelected();

    /// @dev As informações de uma disputa
    struct Dispute {
        uint256 proposalId;
        uint256 bidId;
        uint64 createdAt;
        address proposalCreatorAddress;
        address bidderAddress;
        address mediatorAddress;
        uint8 splitBidderShare;
        bool createdByBidder;
        uint64 distributedAt;
    }

    function getDisputeById(uint256 disputeId)
        external
        view
        returns (
            uint256 proposalId,
            uint256 bidId,
            uint64 createdAt,
            address proposalCreatorAddress,
            address bidderAddress,
            address mediatorAddress,
            uint8 splitBidderShare,
            bool createdByBidder,
            uint64 distributedAt
        );

    function getCountOfDisputes() external view returns (uint256);

    function getDisputeIdByProposalId(uint256 proposalId) external view returns (uint256);

    function getCountOfDisputesByUser(address userAddress) external view returns (uint256);

    function getDisputeIdByUserAddressAndIndex(address userAddress, uint256 index) external view returns (uint256);
}
