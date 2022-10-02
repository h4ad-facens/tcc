import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { deployFixture } from "../deploy.fixture";
import type { Signers } from "../types";
import { shouldBehaveLikeProposal } from "./ProposalCore.behavior";

describe("ProposalCore", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.other = signers[1];
    this.signers.third = signers[2];

    this.loadFixture = loadFixture;
  });

  describe("Proposal", function () {
    beforeEach(async function () {
      const { proposal, bid, dispute } = await this.loadFixture(deployFixture);

      this.proposalCore = proposal;
      this.bidCore = bid;
      this.disputeCore = dispute;
    });

    shouldBehaveLikeProposal();
  });
});
