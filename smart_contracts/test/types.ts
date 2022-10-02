import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { BidCore } from "../src/types/contracts/bids/BidCore";
import { DisputeCore } from "../src/types/contracts/disputes/DisputeCore";
import type { ProposalCore } from "../src/types/contracts/proposals/ProposalCore";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    proposalCore: ProposalCore;
    bidCore: BidCore;
    disputeCore: DisputeCore;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  other: SignerWithAddress;
  third: SignerWithAddress;
}
