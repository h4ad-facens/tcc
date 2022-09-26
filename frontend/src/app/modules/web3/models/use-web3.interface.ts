import { ethers, Signer } from 'ethers';
import { Core } from 'web3modal/dist/core';
import { CertificateCore } from "../nft/CertificateCore";
import { InstitutionCore } from "../nft/InstitutionCore";

export type UseWeb3Store = {
  myAddress: string | null;
  instance: Core | null;
  provider: ethers.providers.Web3Provider | null;
  signer: Signer | null;
  isOwner: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  certificateContract: CertificateCore;
  institutionContract: InstitutionCore;

  setupDefaultContract(): void;
  connect(): Promise<void>;
  logout(): void;
}
