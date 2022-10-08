import { ethers } from 'ethers';

export const ProposalStatus = {
  CANCELLED: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('CANCELLED')),
  FINISHED: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('FINISHED')),
  IN_DEVELOPMENT: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('IN_DEVELOPMENT')),
  IN_DISPUTE: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('IN_DISPUTE')),
  IN_DISPUTE_DISTRIBUTION: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('IN_DISPUTE_DISTRIBUTION')),
  WAITING_BID: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('WAITING_BID')),
};

export interface ProposalProxy {
  id: number;
  name: string;
  description: string;
  amount: number;
  category: string;
  contactInfo: string;
  imageUrl: string;
  shootAccepted?: boolean;
  status: string;
  creator: string;
}
