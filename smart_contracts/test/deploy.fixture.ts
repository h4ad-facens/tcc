import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { BidCore } from "../src/types/contracts/bids/BidCore";
import { DisputeCore } from "../src/types/contracts/disputes/DisputeCore";
import { ProposalCore } from "../src/types/contracts/proposals/ProposalCore";

export async function deployFixture(): Promise<{ proposal: ProposalCore; bid: BidCore; dispute: DisputeCore }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const proposalFactory = await ethers.getContractFactory("ProposalCore");
  const proposal = await proposalFactory.connect(admin).deploy();
  await proposal.deployed();

  const bidFactory = await ethers.getContractFactory("BidCore");
  const bid = await bidFactory.connect(admin).deploy(proposal.address);
  await bid.deployed();

  const disputeFactory = await ethers.getContractFactory("DisputeCore");
  const dispute = await disputeFactory.connect(admin).deploy(proposal.address, bid.address);
  await dispute.deployed();

  await proposal.setBidContractAddress(bid.address);
  await proposal.setDisputeContractAddress(dispute.address);

  return { proposal, bid, dispute };
}
