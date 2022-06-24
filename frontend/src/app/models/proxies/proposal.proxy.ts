import { DisputeStatusEnum } from '../enums/dispute-status.enum';

export interface ProposalProxy {
  title: string;
  description?: string;
  price: number;
  category?: string;
  contact?: string;
  imageUrl: string;
  disputeStatus?: DisputeStatusEnum;
}
