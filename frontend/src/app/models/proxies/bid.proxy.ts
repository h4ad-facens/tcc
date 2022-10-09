import { BigNumber } from 'ethers';

export interface BidProxy {
  id: number;
  proposalId: number;
  bidderAddress: string;
  isCancelled: boolean;
  bidPaidAmount: BigNumber;
  createdAt: Date;
}
