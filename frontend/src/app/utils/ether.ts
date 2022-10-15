import { BigNumber } from 'ethers';
import { formatEther as internalFormat, parseEther } from 'ethers/lib/utils';

export const parseEtherToBigNumber = (ether: number) => parseEther(ether.toString());
export const formatEther = internalFormat;
