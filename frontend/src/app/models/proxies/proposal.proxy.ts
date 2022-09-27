import { DisputeStatusEnum } from '../enums/dispute-status.enum';

export interface ProposalProxy {
  id: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  contact?: string;
  imageUrl?: string;
  shootAccepted?: boolean;
  disputeStatus?: DisputeStatusEnum;
}
