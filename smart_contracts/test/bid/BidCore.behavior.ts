import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import Signer from "ethers";
import { ethers } from "hardhat";

import { impersonate } from "../utils";

export function shouldBehaveLikeBid(): void {
  let currentProposalId: number;

  beforeEach(async function () {
    await this.proposalCore.connect(this.signers.admin).createProposal("test", "test", "test", "test", {
      value: 100,
    });

    currentProposalId = 1;
  });

  describe("createBid", function () {
    it("should create correctly a bid", async function () {
      const createdAtMock = +new Date();
      await ethers.provider.send("evm_setNextBlockTimestamp", [createdAtMock]);

      await this.bidCore.connect(this.signers.admin).createBid(currentProposalId, {
        value: 5,
      });

      const bid = await this.bidCore.getBidById(1);

      expect(bid.bidPaidAmount).to.equal(5);
      expect(bid.bidderAddress).to.equal(this.signers.admin.address);
      expect(bid.proposalId).to.equal(currentProposalId);
      expect(bid.isCancelled).to.equal(false);
      expect(bid.createdAt).to.equal(createdAtMock);
    });

    it("should throw if amount is different than required", async function () {
      const createdAtMock = +new Date();
      await ethers.provider.send("evm_setNextBlockTimestamp", [createdAtMock]);

      const tooLow = await this.bidCore
        .connect(this.signers.admin)
        .createBid(currentProposalId, {
          value: 2,
        })
        .catch(err => err);

      const tooHigh = await this.bidCore
        .connect(this.signers.admin)
        .createBid(currentProposalId, {
          value: 100,
        })
        .catch(err => err);

      expect(tooLow.message).to.contains("InvalidPaymentToCreateBid");
      expect(tooHigh.message).to.contains("InvalidPaymentToCreateBid");
    });

    it("should throw if status is invalid", async function () {
      await this.proposalCore.cancelProposal(currentProposalId);

      const createdAtMock = +new Date();
      await ethers.provider.send("evm_setNextBlockTimestamp", [createdAtMock]);

      const invalidStatus = await this.bidCore
        .connect(this.signers.admin)
        .createBid(currentProposalId, {
          value: 5,
        })
        .catch(err => err);

      expect(invalidStatus.message).to.contains("InvalidProposalStatus");
    });
  });

  describe("Enumerations", function () {
    beforeEach(async function () {
      await this.bidCore.connect(this.signers.admin).createBid(currentProposalId, {
        value: 5,
      });
    });

    it("should return correctly count of bids", async function () {
      expect(await this.bidCore.getCountOfBids()).to.equal(1);

      await this.bidCore.connect(this.signers.admin).createBid(currentProposalId, {
        value: 5,
      });

      expect(await this.bidCore.getCountOfBids()).to.equal(2);
    });

    it("should return correctly count of bid by proposalId", async function () {
      expect(await this.bidCore.getCountOfBidsByProposalId(currentProposalId)).to.equal(1);
      expect(await this.bidCore.getCountOfBidsByProposalId(2)).to.equal(0);

      await this.proposalCore.connect(this.signers.admin).createProposal("test", "test", "test", "test", {
        value: 100,
      });

      await this.bidCore.connect(this.signers.admin).createBid(2, {
        value: 5,
      });

      expect(await this.bidCore.getCountOfBidsByProposalId(currentProposalId)).to.equal(1);
      expect(await this.bidCore.getCountOfBidsByProposalId(2)).to.equal(1);

      await this.bidCore.connect(this.signers.admin).createBid(2, {
        value: 5,
      });

      expect(await this.bidCore.getCountOfBidsByProposalId(currentProposalId)).to.equal(1);
      expect(await this.bidCore.getCountOfBidsByProposalId(2)).to.equal(2);
    });

    it("should return correctly the bidId by proposalId and index", async function () {
      expect(await this.bidCore.getBidIdByProposalIdAndIndex(1, 0)).to.equal(1);
    });

    it("should throw error when get bidId by proposalId and wrong index", async function () {
      const indexOutOfBounds = await this.bidCore.getBidIdByProposalIdAndIndex(1, 100).catch(err => err);

      expect(indexOutOfBounds.message).to.contains("IndexOfUintOutOfBounds");
    });

    it("should return count of bids by user", async function () {
      expect(await this.bidCore.getCountOfBidsByUser(this.signers.other.address)).to.equal(0);
      expect(await this.bidCore.getCountOfBidsByUser(this.signers.admin.address)).to.equal(1);

      await this.bidCore.connect(this.signers.admin).createBid(1, {
        value: 5,
      });

      expect(await this.bidCore.getCountOfBidsByUser(this.signers.admin.address)).to.equal(2);
    });

    it("should return bid id by userAddress and index", async function () {
      expect(await this.bidCore.getBidIdByUserAndIndex(this.signers.admin.address, 0)).to.equal(1);
    });

    it("should throw error on sending wrong index to get bidId by user address", async function () {
      const error = await this.bidCore.getBidIdByUserAndIndex(this.signers.admin.address, 1000).catch(err => err);

      expect(error.message).to.contains("IndexOfAddressOutOfBounds");
    });

    it("should get selected by id by proposalId", async function () {
      await this.bidCore.connect(this.signers.admin).selectBid(currentProposalId, 1);

      expect(await this.bidCore.getSelectedBidIdByProposalId(currentProposalId)).to.equal(1);
    });

    it("should throw error if bid was not selected when get selected by proposal", async function () {
      const error = await this.bidCore.getSelectedBidIdByProposalId(currentProposalId).catch(err => err);

      expect(error.message).to.contains("NoBidSelectedForProposal");
    });
  });

  describe("cancelBid", function () {
    beforeEach(async function () {
      await this.bidCore.connect(this.signers.admin).createBid(currentProposalId, {
        value: 5,
      });
    });

    it("should cancel bid correctly", async function () {
      await this.bidCore.connect(this.signers.admin).cancelBid(currentProposalId, 1);

      const bid = await this.bidCore.getBidById(1);

      expect(bid.isCancelled).to.equal(true);
    });

    it("should not cancel bid twice", async function () {
      await this.bidCore.connect(this.signers.admin).cancelBid(currentProposalId, 1);

      const error = await this.bidCore
        .connect(this.signers.admin)
        .cancelBid(currentProposalId, 1)
        .catch(err => err);

      expect(error.message).to.contains("BidAlreadyCancelled");
    });

    it("should not cancel bid when user is not the proposal creator", async function () {
      const error = await this.bidCore
        .connect(this.signers.other)
        .cancelBid(currentProposalId, 1)
        .catch(err => err);

      expect(error.message).to.contains("YouAreNotTheBidCreator");
    });

    it("should not cancel bid passing proposalId of other bid", async function () {
      await this.proposalCore.connect(this.signers.admin).createProposal("test", "test", "test", "test", {
        value: 100,
      });

      const error = await this.bidCore
        .connect(this.signers.admin)
        .cancelBid(2, 1)
        .catch(err => err);

      expect(error.message).to.contains("BidNotBelongsToProposal");
    });

    it("should not cancel bid after bid is selected", async function () {
      await this.bidCore.connect(this.signers.admin).selectBid(currentProposalId, 1);

      const error = await this.bidCore
        .connect(this.signers.admin)
        .cancelBid(currentProposalId, 1)
        .catch(err => err);

      expect(error.message).to.contains("CannotCancelBidWhenSelected");
    });

    it("should not cancel bid that dons't not exist", async function () {
      const error = await this.bidCore
        .connect(this.signers.admin)
        .cancelBid(currentProposalId, 1000)
        .catch(err => err);

      expect(error.message).to.contains("BidNotFound");
    });
  });

  describe("selectBid", function () {
    beforeEach(async function () {
      await this.bidCore.connect(this.signers.admin).createBid(currentProposalId, {
        value: 5,
      });
    });

    it("should select bid correctly", async function () {
      const proposalBefore = await this.proposalCore.getProposalById(currentProposalId);

      expect(proposalBefore.status).to.equal(await this.proposalCore.WAITING_BID());

      await this.bidCore.connect(this.signers.admin).selectBid(currentProposalId, 1);

      expect(await this.bidCore.getSelectedBidIdByProposalId(currentProposalId)).to.equal(1);

      const proposal = await this.proposalCore.getProposalById(currentProposalId);

      expect(proposal.status).to.equal(await this.proposalCore.IN_DEVELOPMENT());
    });

    it("should not select bid twice", async function () {
      await this.bidCore.connect(this.signers.admin).selectBid(currentProposalId, 1);

      const error = await this.bidCore
        .connect(this.signers.admin)
        .selectBid(currentProposalId, 1)
        .catch(err => err);

      expect(error.message).to.contains("ProposalAlreadySelectedBid");
    });

    it("should not select bid cancelled", async function () {
      await this.bidCore.connect(this.signers.admin).cancelBid(currentProposalId, 1);

      const error = await this.bidCore
        .connect(this.signers.admin)
        .selectBid(currentProposalId, 1)
        .catch(err => err);

      expect(error.message).to.contains("CannotSelectCancelledBid");
    });

    it("should not select bid if proposal is with other status", async function () {
      await this.proposalCore.cancelProposal(1);

      const error = await this.bidCore
        .connect(this.signers.admin)
        .selectBid(currentProposalId, 1)
        .catch(err => err);

      expect(error.message).to.contains("InvalidProposalStatus");
    });

    it("should not select bid when user is not the proposal creator", async function () {
      const error = await this.bidCore
        .connect(this.signers.other)
        .selectBid(currentProposalId, 1)
        .catch(err => err);

      expect(error.message).to.contains("YouAreNotTheProposalCreator");
    });

    it("should not select bid that dons't not exist", async function () {
      const error = await this.bidCore
        .connect(this.signers.admin)
        .selectBid(currentProposalId, 1000)
        .catch(err => err);

      expect(error.message).to.contains("BidNotFound");
    });
  });

  describe("transferPayment", function () {
    beforeEach(async function () {
      await this.bidCore.connect(this.signers.admin).createBid(currentProposalId, {
        value: 5,
      });

      await this.bidCore.connect(this.signers.admin).selectBid(currentProposalId, 1);
    });

    it("should transfer the payment", async function () {
      await this.bidCore.connect(this.signers.admin).transferPayment(currentProposalId);

      const proposal = await this.proposalCore.getProposalById(currentProposalId);

      expect(proposal.status).to.equal(await this.proposalCore.FINISHED());
    });

    it("should throw error when proposal is in wrong status", async function () {
      await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

      await this.proposalCore.connect(this.signers.other).onCreateDispute(currentProposalId);

      const error = await this.bidCore
        .connect(this.signers.admin)
        .transferPayment(currentProposalId)
        .catch(err => err);

      expect(error.message).to.contains("InvalidProposalStatus");
    });

    it("should throw error when user is not the proposal creator", async function () {
      const error = await this.bidCore
        .connect(this.signers.other)
        .transferPayment(currentProposalId)
        .catch(err => err);

      expect(error.message).to.contains("YouAreNotTheProposalCreator");
    });
  });

  describe("onSelectDistribution", function () {
    beforeEach(async function () {
      await this.bidCore.connect(this.signers.third).createBid(currentProposalId, {
        value: 5,
      });

      await this.bidCore.connect(this.signers.admin).selectBid(currentProposalId, 1);

      const bidSigner = await impersonate(this.bidCore.address);
      const proposalSigner = await impersonate(this.proposalCore.address);

      await this.signers.admin.sendTransaction({
        value: ethers.utils.parseEther("1.0"),
        to: await proposalSigner.getAddress(),
      });

      await this.signers.admin.sendTransaction({
        value: ethers.utils.parseEther("1.0"),
        to: await bidSigner.getAddress(),
      });
    });

    it("should onDistributeDispute", async function () {
      await this.bidCore.connect(this.signers.admin).transferPayment(currentProposalId);

      const balance = await this.signers.third.getBalance();

      const proposalSigner = await impersonate(this.proposalCore.address);

      await this.bidCore.connect(proposalSigner).onSelectDistribution(1);

      const newBalance = await this.signers.third.getBalance();

      expect(newBalance.eq(balance.add(5)), `${balance.toString()} = ${newBalance.toString()}`).to.eq(true);
    });

    it("should throw error when bidId not exist", async function () {
      await this.bidCore.connect(this.signers.admin).transferPayment(currentProposalId);

      const proposalSigner = await impersonate(this.proposalCore.address);

      const error = await this.bidCore
        .connect(proposalSigner)
        .onSelectDistribution(10000)
        .catch(err => err);

      expect(error.message).to.contains("BidNotFound");
    });

    it("should throw error when invalid status", async function () {
      const proposalSigner = await impersonate(this.proposalCore.address);

      const error = await this.bidCore
        .connect(proposalSigner)
        .onSelectDistribution(1)
        .catch(err => err);

      expect(error.message).to.contains("InvalidProposalStatus");
    });

    it("should throw error when signer is not valid", async function () {
      const error = await this.bidCore
        .connect(this.signers.admin)
        .onSelectDistribution(1)
        .catch(err => err);

      expect(error.message).to.contains("ForbiddenAccessToMethod");
    });
  });
}
