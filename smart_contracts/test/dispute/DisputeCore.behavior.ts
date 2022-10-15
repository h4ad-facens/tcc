import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export function shouldBehaveLikeDispute(): void {
  let proposalCreatorAddress: string;
  let bidderAddress: string;

  beforeEach(async function () {
    proposalCreatorAddress = this.signers.admin.address;
    bidderAddress = this.signers.third.address;

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 100,
    });

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

    await this.bidCore.connect(this.signers.third).createBid(1, {
      value: 5,
    });
    await this.bidCore.connect(this.signers.admin).selectBid(1, 1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DEVELOPMENT());
  });

  describe("createDispute", function () {
    it("should create correctly a dispute as proposalCreator", async function () {
      const createdAtMock = +new Date();
      await ethers.provider.send("evm_setNextBlockTimestamp", [createdAtMock]);

      expect(await this.disputeCore.getCountOfDisputesByUser(proposalCreatorAddress)).to.equal(0);
      expect(await this.disputeCore.getCountOfDisputesByUser(bidderAddress)).to.equal(0);
      expect(await this.disputeCore.getCountOfDisputes()).to.equal(0);
      expect(await ethers.provider.getBalance(this.disputeCore.address)).to.equal(0);

      await this.disputeCore.connect(this.signers.admin).createDispute(1);

      expect(await this.disputeCore.getCountOfDisputes()).to.equal(1);
      expect(await this.disputeCore.getCountOfDisputesByUser(proposalCreatorAddress)).to.equal(1);
      expect(await this.disputeCore.getCountOfDisputesByUser(bidderAddress)).to.equal(1);
      expect(await this.disputeCore.getDisputeIdByUserAddressAndIndex(proposalCreatorAddress, 0)).to.equal(1);
      expect(await this.disputeCore.getDisputeIdByUserAddressAndIndex(bidderAddress, 0)).to.equal(1);
      expect(await this.disputeCore.getDisputeIdByProposalId(1)).to.equal(1);

      const disputeInfo = await this.disputeCore.getDisputeById(1);

      expect(disputeInfo.proposalId).to.equal(1);
      expect(disputeInfo.bidId).to.equal(1);
      expect(disputeInfo.proposalCreatorAddress).to.equal(proposalCreatorAddress);
      expect(disputeInfo.bidderAddress).to.equal(bidderAddress);
      expect(disputeInfo.mediatorAddress).to.equal(ethers.constants.AddressZero);
      expect(disputeInfo.splitBidderShare).to.equal(0);
      expect(disputeInfo.createdByBidder).to.equal(false);
      expect(disputeInfo.distributedAt).to.equal(0);
      expect(disputeInfo.createdAt.toNumber()).to.equal(createdAtMock);
    });

    it("should create correctly a dispute as bidder", async function () {
      await this.disputeCore.connect(this.signers.third).createDispute(1);

      const disputeInfo = await this.disputeCore.getDisputeById(1);

      expect(disputeInfo.createdByBidder).to.equal(true);

      expect(await this.disputeCore.getCountOfDisputes()).to.equal(1);
      expect(await this.disputeCore.getCountOfDisputesByUser(proposalCreatorAddress)).to.equal(1);
      expect(await this.disputeCore.getCountOfDisputesByUser(bidderAddress)).to.equal(1);
      expect(await this.disputeCore.getDisputeIdByUserAddressAndIndex(proposalCreatorAddress, 0)).to.equal(1);
      expect(await this.disputeCore.getDisputeIdByUserAddressAndIndex(bidderAddress, 0)).to.equal(1);
      expect(await this.disputeCore.getDisputeIdByProposalId(1)).to.equal(1);
    });

    it("should throw error if proposal dont have dispute", async function () {
      const error = await this.disputeCore.getDisputeIdByProposalId(1).catch(err => err);

      expect(error.message).to.contains("NoDisputeCreatedForProposal");
    });

    it("should throw error if dispute dont exist", async function () {
      const error = await this.disputeCore.getDisputeById(10000).catch(err => err);

      expect(error.message).to.contains("DisputeNotFound");
    });

    it("should cannot create dispute when proposalStatus is invalid", async function () {
      await this.bidCore.connect(this.signers.admin).transferPayment(1);

      const error = await this.disputeCore
        .connect(this.signers.admin)
        .createDispute(1)
        .catch(err => err);

      expect(error.message).to.contains("InvalidStatusToCreateDispute");
    });

    it("should cannot create dispute you are not the proposalCreator or bidderAddress", async function () {
      const error = await this.disputeCore
        .connect(this.signers.other)
        .createDispute(1)
        .catch(err => err);

      expect(error.message).to.contains("YouAreNotTheBidderOrProposalCreator");
    });

    it("should cannot create dispute twice", async function () {
      await this.disputeCore.connect(this.signers.admin).createDispute(1);

      const error = await this.disputeCore
        .connect(this.signers.admin)
        .createDispute(1)
        .catch(err => err);

      expect(error.message).to.contains("DisputeAlreadyExist");
    });
  });

  describe("selectMediator", function () {
    beforeEach(async function () {
      await this.disputeCore.connect(this.signers.third).createDispute(1);
    });

    it("should select correctly the mediator", async function () {
      expect(
        await this.disputeCore.getPendingSelectedMediatorByUserAddressAndDisputeId(this.signers.third.address, 1)
      ).to.equal(ethers.constants.AddressZero);

      await this.disputeCore.connect(this.signers.third).selectMediator(1, this.signers.other.address);

      expect(
        await this.disputeCore.getPendingSelectedMediatorByUserAddressAndDisputeId(this.signers.third.address, 1)
      ).to.equal(this.signers.other.address);

      expect(
        await this.disputeCore.getPendingSelectedMediatorByUserAddressAndDisputeId(this.signers.admin.address, 1)
      ).to.equal(ethers.constants.AddressZero);

      await this.disputeCore.connect(this.signers.admin).selectMediator(1, this.signers.other.address);

      expect(
        await this.disputeCore.getPendingSelectedMediatorByUserAddressAndDisputeId(this.signers.admin.address, 1)
      ).to.equal(this.signers.other.address);

      const dispute = await this.disputeCore.getDisputeById(1);

      expect(dispute.mediatorAddress).to.equal(this.signers.other.address);
    });

    it("should override when select twice", async function () {
      await this.disputeCore.connect(this.signers.third).selectMediator(1, this.signers.admin.address);
      await this.disputeCore.connect(this.signers.third).selectMediator(1, this.signers.other.address);
      await this.disputeCore.connect(this.signers.admin).selectMediator(1, this.signers.other.address);

      const dispute = await this.disputeCore.getDisputeById(1);

      expect(dispute.mediatorAddress).to.equal(this.signers.other.address);
    });

    it("should throw error if user is not the proposalCreator or bidder", async function () {
      const error = await this.disputeCore
        .connect(this.signers.other)
        .selectMediator(1, this.signers.other.address)
        .catch(err => err);

      expect(error.message).to.contains("YouAreNotTheBidderOrProposalCreator");
    });

    it("should throw error if try to select mediator twice", async function () {
      await this.disputeCore.connect(this.signers.third).selectMediator(1, this.signers.other.address);
      await this.disputeCore.connect(this.signers.admin).selectMediator(1, this.signers.other.address);

      const error = await this.disputeCore
        .connect(this.signers.other)
        .selectMediator(1, this.signers.other.address)
        .catch(err => err);

      expect(error.message).to.contains("MediatorAlreadySelected");
    });

    it("should throw error if dispute dont exist", async function () {
      const error = await this.disputeCore.selectMediator(100, this.signers.other.address).catch(err => err);

      expect(error.message).to.contains("DisputeNotFound");
    });
  });

  describe("selectDistribution", function () {
    beforeEach(async function () {
      await this.disputeCore.connect(this.signers.third).createDispute(1);
    });

    it("should correctly distribute payments to proposalCreator", async function () {
      await this.disputeCore.connect(this.signers.third).selectMediator(1, this.signers.other.address);
      await this.disputeCore.connect(this.signers.admin).selectMediator(1, this.signers.other.address);

      const proposalCreatorBalance = await this.signers.admin.getBalance();

      const createdAtMock = +new Date();
      await ethers.provider.send("evm_setNextBlockTimestamp", [createdAtMock]);

      await this.disputeCore.connect(this.signers.other).selectDistribution(1, 0);

      const newProposalCreatorBalance = await this.signers.admin.getBalance();

      expect(
        newProposalCreatorBalance.eq(proposalCreatorBalance.add(95)),
        `${proposalCreatorBalance.toString()} = ${newProposalCreatorBalance.toString()}`,
      ).to.equal(true);

      const disputeInfo = await this.disputeCore.getDisputeById(1);

      expect(disputeInfo.splitBidderShare).to.eq(0);
      expect(disputeInfo.distributedAt.toNumber()).to.equal(createdAtMock);
    });

    it("should correctly distribute payments to bidder", async function () {
      await this.disputeCore.connect(this.signers.third).selectMediator(1, this.signers.admin.address);
      await this.disputeCore.connect(this.signers.admin).selectMediator(1, this.signers.admin.address);

      const bidderBalance = await this.signers.third.getBalance();

      const createdAtMock = +new Date();
      await ethers.provider.send("evm_setNextBlockTimestamp", [createdAtMock]);

      await this.disputeCore.connect(this.signers.admin).selectDistribution(1, 100);

      const newBidderBalance = await this.signers.third.getBalance();

      expect(
        newBidderBalance.eq(bidderBalance.add(95 + 5)),
        `${bidderBalance.toString()} = ${newBidderBalance.toString()}`,
      ).to.equal(true);

      const disputeInfo = await this.disputeCore.getDisputeById(1);

      expect(disputeInfo.splitBidderShare).to.eq(100);
      expect(disputeInfo.distributedAt.toNumber()).to.equal(createdAtMock);
    });

    it("should throw error if mediator was not selected yet", async function () {
      const error = await this.disputeCore
        .connect(this.signers.other)
        .selectDistribution(1, 100)
        .catch(err => err);

      expect(error.message).to.contains("YouAreNotTheMediator");
    });

    it("should throw error split share is invalid", async function () {
      await this.disputeCore.connect(this.signers.third).selectMediator(1, this.signers.other.address);
      await this.disputeCore.connect(this.signers.admin).selectMediator(1, this.signers.other.address);

      const error = await this.disputeCore
        .connect(this.signers.other)
        .selectDistribution(1, 200)
        .catch(err => err);

      expect(error.message).to.contains("InvalidAmountOfShare");
    });

    it("should throw error if dispute dont exist", async function () {
      const error = await this.disputeCore
        .connect(this.signers.other)
        .selectDistribution(100, 100)
        .catch(err => err);

      expect(error.message).to.contains("DisputeNotFound");
    });

    it("should throw error if distribute twice", async function () {
      await this.disputeCore.connect(this.signers.third).selectMediator(1, this.signers.other.address);
      await this.disputeCore.connect(this.signers.admin).selectMediator(1, this.signers.other.address);

      await this.disputeCore.connect(this.signers.other).selectDistribution(1, 100);

      const error = await this.disputeCore
        .connect(this.signers.other)
        .selectDistribution(1, 100)
        .catch(err => err);

      expect(error.message).to.contains("DisputeAlreadyDistributed");
    });
  });
}
