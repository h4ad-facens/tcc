import { DisputeStatusEnum } from '../enums/dispute-status.enum';

export interface CardInterface {
  title: string;
  price: number;
  disputeStatus?: DisputeStatusEnum;
}
