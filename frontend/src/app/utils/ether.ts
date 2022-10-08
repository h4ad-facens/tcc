import { BigNumber } from 'ethers';
import { formatEther as internalFormat, parseEther } from 'ethers/lib/utils';

export const parseEtherToBigNumber = (ether: number) => BigNumber.from(ether).mul(BigNumber.from(10).pow(18));
export const formatEther = internalFormat;
