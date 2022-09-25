// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

interface IBidBase {
    error BidNotFound();
    error NoBidSelectedForProposal();
    error InvalidStatusToCreateBid(bytes32 currentStatus);
    error InvalidPaymentToCreateBid(uint256 correctAmountToPay);

    error ProposalAlreadySelectedBid(uint256 selectedBidId);
    error CannotSelectCancelledBid();
    error InvalidStatusToSelectBid(bytes32 currentProposalStatus);

    error YouAreNotTheProposalCreator(address correctProposalCreatorAddress);
    error YouAreNotTheBidCreator(address correctBidCreatorAddress);

    error BidAlreadyCancelled();
    error BidNotBelongsToProposal(uint256 correctProposalId);
    error CannotCancelBidWhenSelected();

    error InvalidStatusToTransferProposal(bytes32 currentProposalStatus);

    error InvalidStatusToFinish(bytes32 currentProposalStatus);

    /// @dev As informações de um lance
    struct Bid {
        uint256 proposalId;
        address bidderAddress;
        bool isCancelled;
        uint256 bidPaidAmount;
        uint64 createdAt;
    }

    function getBidById(uint256 bidId)
        external
        view
        returns (
            uint256 proposalId,
            address bidderAddress,
            bool isCancelled,
            uint256 bidPaidAmount,
            uint64 createdAt
        );

    function getCountOfBids() external view returns (uint256);

    function getCountOfBidsByProposalId(uint256 proposalId) external view returns (uint256);

    function getBidIdByProposalIdAndIndex(uint256 proposalId, uint256 index) external view returns (uint256);

    function getCountOfBidsByUser(address userAddress) external view returns (uint256);

    function getBidIdByUserAndIndex(address userAddress, uint256 index) external view returns (uint256);

    function getSelectedBidIdByProposalId(uint256 proposalId) external view returns (uint256);
}
