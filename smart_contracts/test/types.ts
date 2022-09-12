import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { ProposalCore } from "../src/types/contracts/proposals/ProposalCore";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    proposalCore: ProposalCore;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  other: SignerWithAddress;
  third: SignerWithAddress;
}