import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBehaveLikeProposal(): void {
  it("should create correctly a proposal", async function () {
    const creatorAddress = this.signers.admin.address;

    const createdAtMock = +new Date();
    await ethers.provider.send("evm_setNextBlockTimestamp", [createdAtMock]);

    expect(await this.proposalCore.getCountOfProposalsByUser(creatorAddress)).to.equal(0);
    expect(await this.proposalCore.getCountOfProposals()).to.equal(0);
    expect(await ethers.provider.getBalance(this.proposalCore.address)).to.equal(0);

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await ethers.provider.getBalance(this.proposalCore.address)).to.equal(10);

    expect(await this.proposalCore.getCountOfProposals()).to.equal(1);
    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());
    expect(await this.proposalCore.getCountOfProposalsByUser(creatorAddress)).to.equal(1);
    expect(await this.proposalCore.getProposalIdByUserAndIndex(creatorAddress, 0)).to.equal(1);

    const proposalInfo = await this.proposalCore.getProposalById(1);

    expect(proposalInfo.name).to.equal("teste");
    expect(proposalInfo.description).to.equal("uma proposta legal");
    expect(proposalInfo.category).to.equal("teste");
    expect(proposalInfo.contactInfo).to.equal("00");
    expect(proposalInfo.creator).to.equal(creatorAddress);
    expect(proposalInfo.amount).to.equal(10);
    expect(proposalInfo.createdAt.toNumber()).to.equal(createdAtMock);

    const otherSigner = this.signers.other;

    await this.proposalCore.connect(otherSigner).createProposal("test another", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await this.proposalCore.getCountOfProposals()).to.equal(2);
    expect(await this.proposalCore.getStatusOfProposal(2)).to.equal(await this.proposalCore.WAITING_BID());

    expect(await this.proposalCore.getCountOfProposalsByUser(creatorAddress)).to.equal(1);
    expect(await this.proposalCore.getProposalIdByUserAndIndex(creatorAddress, 0)).to.equal(1);

    expect(await this.proposalCore.getCountOfProposalsByUser(otherSigner.address)).to.equal(1);
    expect(await this.proposalCore.getProposalIdByUserAndIndex(otherSigner.address, 0)).to.equal(2);

    expect(await ethers.provider.getBalance(this.proposalCore.address)).to.equal(20);
  });

  it("should validate index in getProposalIdByIndexAndUser", async function () {
    const errorOnGetId = await this.proposalCore
      .getProposalIdByUserAndIndex(this.signers.admin.address, 0)
      .catch(error => error);

    expect(errorOnGetId.errorName).to.equal("IndexOfAddressOutOfBounds");
  });

  it("should validate proposalId in getProposalById", async function () {
    const errorOnGetId = await this.proposalCore.getProposalById(10000).catch(error => error);

    expect(errorOnGetId.errorName).to.equal("ProposalNotFound");
  });

  it("should validate proposalId in getStatusOfProposal", async function () {
    const errorOnGetId = await this.proposalCore.getStatusOfProposal(10000).catch(error => error);

    expect(errorOnGetId.errorName).to.equal("ProposalNotFound");
  });

  it("should validate amount when createProposal", async function () {
    const result = await this.proposalCore
      .connect(this.signers.admin)
      .createProposal("teste", "uma proposta legal", "teste", "00", {
        value: 0,
      })
      .catch(error => error);

    expect(result.message).to.contains("AmountTooLow");
  });

  it("should cancel a proposal", async function () {
    expect(await ethers.provider.getBalance(this.proposalCore.address)).to.equal(0);

    await this.proposalCore.connect(this.signers.other).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

    await this.proposalCore.connect(this.signers.other).cancelProposal(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.CANCELLED());
    expect(await ethers.provider.getBalance(this.proposalCore.address)).to.equal(0);

    const cannotCancelTwice = await this.proposalCore
      .connect(this.signers.other)
      .cancelProposal(1)
      .catch(error => error);

    expect(cannotCancelTwice.message).to.contains("InvalidProposalStatus");
  });

  it("should not cancel proposal without being owner", async function () {
    await this.proposalCore.connect(this.signers.other).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    const result = await this.proposalCore
      .connect(this.signers.admin)
      .cancelProposal(1)
      .catch(error => error);

    expect(result.message).to.contains("YouAreNotTheCreator");
  });

  it("should can call onBidderSelected", async function () {
    await this.proposalCore.connect(this.signers.admin).setBidContractAddress(this.signers.admin.address);
    await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

    await this.proposalCore.connect(this.signers.admin).onBidderSelected(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DEVELOPMENT());

    const error = await this.proposalCore
      .connect(this.signers.admin)
      .onBidderSelected(1)
      .catch(error => error);

    expect(error.message).to.contains("InvalidProposalStatus");

    const errorAboutPermission = await this.proposalCore
      .connect(this.signers.third)
      .onBidderSelected(1)
      .catch(error => error);

    expect(errorAboutPermission.message).to.contains("ForbiddenAccessToMethod");

    const errorAboutNotFound = await this.proposalCore
      .connect(this.signers.admin)
      .onBidderSelected(1000)
      .catch(error => error);

    expect(errorAboutNotFound.message).to.contains("ProposalNotFound");
  });

  it("should can call onPaymentTransferred", async function () {
    await this.proposalCore.connect(this.signers.admin).setBidContractAddress(this.signers.admin.address);
    await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

    await this.proposalCore.connect(this.signers.admin).onBidderSelected(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DEVELOPMENT());

    await this.proposalCore.connect(this.signers.admin).onPaymentTransferred(1, this.signers.other.address);

    const error = await this.proposalCore
      .connect(this.signers.admin)
      .onPaymentTransferred(1, this.signers.other.address)
      .catch(error => error);

    expect(error.message).to.contains("InvalidProposalStatus");

    const errorAboutPermission = await this.proposalCore
      .connect(this.signers.third)
      .onPaymentTransferred(1, this.signers.other.address)
      .catch(error => error);

    expect(errorAboutPermission.message).to.contains("ForbiddenAccessToMethod");

    const errorAboutNotFound = await this.proposalCore
      .connect(this.signers.admin)
      .onPaymentTransferred(1000, this.signers.other.address)
      .catch(error => error);

    expect(errorAboutNotFound.message).to.contains("ProposalNotFound");
  });

  it("should can call onCreateDispute", async function () {
    await this.proposalCore.connect(this.signers.admin).setBidContractAddress(this.signers.admin.address);
    await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

    await this.proposalCore.connect(this.signers.admin).onBidderSelected(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DEVELOPMENT());

    await this.proposalCore.connect(this.signers.other).onCreateDispute(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DISPUTE());

    const error = await this.proposalCore
      .connect(this.signers.other)
      .onCreateDispute(1)
      .catch(error => error);

    expect(error.message).to.contains("InvalidProposalStatus");

    const errorAboutPermission = await this.proposalCore
      .connect(this.signers.third)
      .onCreateDispute(1)
      .catch(error => error);

    expect(errorAboutPermission.message).to.contains("ForbiddenAccessToMethod");

    const errorAboutNotFound = await this.proposalCore
      .connect(this.signers.admin)
      .onCreateDispute(1000)
      .catch(error => error);

    expect(errorAboutNotFound.message).to.contains("ProposalNotFound");
  });

  it("should can call onMediatorSelected", async function () {
    await this.proposalCore.connect(this.signers.admin).setBidContractAddress(this.signers.admin.address);
    await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

    await this.proposalCore.connect(this.signers.admin).onBidderSelected(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DEVELOPMENT());

    await this.proposalCore.connect(this.signers.other).onCreateDispute(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DISPUTE());

    await this.proposalCore.connect(this.signers.other).onMediatorSelected(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DISPUTE_DISTRIBUTION());

    const error = await this.proposalCore
      .connect(this.signers.other)
      .onMediatorSelected(1)
      .catch(error => error);

    expect(error.message).to.contains("InvalidProposalStatus");

    const errorAboutPermission = await this.proposalCore
      .connect(this.signers.third)
      .onMediatorSelected(1)
      .catch(error => error);

    expect(errorAboutPermission.message).to.contains("ForbiddenAccessToMethod");

    const errorAboutNotFound = await this.proposalCore
      .connect(this.signers.admin)
      .onMediatorSelected(1000)
      .catch(error => error);

    expect(errorAboutNotFound.message).to.contains("ProposalNotFound");
  });

  describe("onSelectDistribution", function () {
    beforeEach(async function () {
      await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

      await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
        value: 100,
      });

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

      await this.bidCore.connect(this.signers.third).createBid(1, {
        value: 5,
      });
      await this.bidCore.connect(this.signers.admin).selectBid(1, 1);

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DEVELOPMENT());

      await this.proposalCore.connect(this.signers.other).onCreateDispute(1);

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DISPUTE());

      await this.proposalCore.connect(this.signers.other).onMediatorSelected(1);

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(
        await this.proposalCore.IN_DISPUTE_DISTRIBUTION(),
      );
    });

    it("should can call correctly and transfer the values", async function () {
      const balance = await this.signers.third.getBalance();

      await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1, 1, this.signers.third.address, 50);

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.FINISHED());

      const newBalance = await this.signers.third.getBalance();

      const valueToRestore = 47 + 5; // 10 (proposta) + 1 (lance)
      expect(newBalance.eq(balance.add(valueToRestore)), `${balance.toString()} = ${newBalance.toString()}`).to.equal(
        true,
      );

      const error = await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1, 1, this.signers.third.address, 50)
        .catch(error => error);

      expect(error.message).to.contains("InvalidProposalStatus");
    });

    it("should transfer ok with splitShare in 0", async function () {
      await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1, 1, this.signers.third.address, 0);

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.FINISHED());
    });

    it("should transfer ok with splitShare in 100", async function () {
      await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1, 1, this.signers.third.address, 100);

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.FINISHED());
    });

    it("should transfer not transfer when splitShare result in low amount for bidder", async function () {
      await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1, 1, this.signers.third.address, 1);

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.FINISHED());
    });

    it("should transfer not transfer when splitShare result in low amount for creator", async function () {
      await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1, 1, this.signers.third.address, 99);

      expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.FINISHED());
    });

    it("should throw error when bidId is wrong", async function () {
      const errorAboutBidNotFound = await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1, 100, this.signers.third.address, 50)
        .catch(error => error);

      expect(errorAboutBidNotFound.message, JSON.stringify(errorAboutBidNotFound)).to.contains("BidNotFound");
    });

    it("should throw if dont have access", async function () {
      const errorAboutPermission = await this.proposalCore
        .connect(this.signers.third)
        .onSelectDistribution(this.signers.third.address, 1, 1, this.signers.third.address, 50)
        .catch(error => error);

      expect(errorAboutPermission.message).to.contains("ForbiddenAccessToMethod");
    });

    it("should throw if proposal dont exist", async function () {
      const errorAboutNotFound = await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1000, 1, this.signers.third.address, 50)
        .catch(error => error);

      expect(errorAboutNotFound.message).to.contains("ProposalNotFound");
    });

    it("should throw if split share is wrong", async function () {
      const errorInvalidSplitBidderShare = await this.proposalCore
        .connect(this.signers.other)
        .onSelectDistribution(this.signers.other.address, 1, 1, this.signers.third.address, 200)
        .catch(error => error);

      expect(errorInvalidSplitBidderShare.message).to.contains("InvalidSplitBidderShare");
    });
  });

  it("should user is not owner cannot update bid or dispute address", async function () {
    const bidError = await this.proposalCore
      .connect(this.signers.other)
      .setBidContractAddress(this.signers.admin.address)
      .catch(error => error);
    const disputeError = await this.proposalCore
      .connect(this.signers.other)
      .setDisputeContractAddress(this.signers.admin.address)
      .catch(error => error);

    expect(bidError.message).to.contains("Ownable");
    expect(disputeError.message).to.contains("Ownable");
  });

  it("should cannot set bid or dispute address as zero", async function () {
    const bidError = await this.proposalCore
      .connect(this.signers.admin)
      .setBidContractAddress(ethers.constants.AddressZero)
      .catch(error => error);
    const disputeError = await this.proposalCore
      .connect(this.signers.admin)
      .setDisputeContractAddress(ethers.constants.AddressZero)
      .catch(error => error);

    expect(bidError.message).to.contains("InvalidAddress");
    expect(disputeError.message).to.contains("InvalidAddress");
  });
}
