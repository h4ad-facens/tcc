import { randEthereumAddress, randPhoneNumber, randPhrase, randProductCategory, randProductName } from '@ngneat/falso';
import { BigNumber, ethers } from 'ethers';
import { BoringPipe } from '../../pipes/boring.pipe';

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
  amount: BigNumber;
  category: string;
  contactInfo: string;
  imageUrl: string;
  status: string;
  creator: string;
}

export function createMockProposal(id: number, status: string, amount: BigNumber = BigNumber.from(1)): ProposalProxy {
  return {
    id,
    name: randProductName(),
    description: randPhrase(),
    category: randProductCategory(),
    contactInfo: randPhoneNumber(),
    amount,
    imageUrl: BoringPipe.getSvg(`proposals_${ id }`, 'bauhaus'),
    creator: randEthereumAddress(),
    status,
  };
}
