import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { ProposalCore } from "../../src/types/contracts/proposals/ProposalCore";

export async function deployProposalFixture(): Promise<{ proposal: ProposalCore }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const proposalFactory = await ethers.getContractFactory("ProposalCore");
  const proposal: ProposalCore = <ProposalCore>await proposalFactory.connect(admin).deploy();
  await proposal.deployed();

  return { proposal };
}
