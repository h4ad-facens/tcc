export interface DisputeProxy {
  id: number;
  proposalId: number;
  bidId: number;
  createdAt: Date;
  proposalCreatorAddress: string;
  bidderAddress: string;
  mediatorAddress: string | null;
  splitBidderShare: number | 0;
  createdByBidder: boolean;
  distributedAt: Date | null;
}
