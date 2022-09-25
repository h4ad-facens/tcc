import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { BidCore } from "../../src/types/contracts/bids/BidCore";
import { ProposalCore } from "../../src/types/contracts/proposals/ProposalCore";
import { deployProposalFixture } from "../proposal/ProposalCore.fixture";

export async function deployBidFixture(): Promise<{ proposal: ProposalCore; bid: BidCore }> {
  const { proposal } = await deployProposalFixture();

  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const bidFactory = await ethers.getContractFactory("BidCore");
  const bid = await bidFactory.connect(admin).deploy(proposal.address);
  await bid.deployed();

  await proposal.setBidContractAddress(bid.address);

  return { proposal, bid };
}
