import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBehaveLikeProposal(): void {
  it("should create correctly an proposal", async function () {
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

    expect(cannotCancelTwice.message).to.contains("InvalidStatusToCancel");
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

  it("should can call on bidder selected", async function () {
    await this.proposalCore.connect(this.signers.admin).setBidContractAddress(this.signers.admin.address);
    await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

    await this.proposalCore.connect(this.signers.other).onBidderSelected(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DEVELOPMENT());

    const error = await this.proposalCore
      .connect(this.signers.admin)
      .onBidderSelected(1)
      .catch(error => error);

    expect(error.message).to.contains("InvalidStatusToSelectBidder");

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

  it("should can call next dispute status", async function () {
    await this.proposalCore.connect(this.signers.admin).setBidContractAddress(this.signers.admin.address);
    await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    await this.proposalCore.connect(this.signers.other).onBidderSelected(1);

    await this.proposalCore.connect(this.signers.admin).nextDisputeStatus(1, await this.proposalCore.IN_DISPUTE());

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DISPUTE());

    await this.proposalCore
      .connect(this.signers.admin)
      .nextDisputeStatus(1, await this.proposalCore.IN_DISPUTE_DISTRIBUTION());

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DISPUTE_DISTRIBUTION());

    const error = await this.proposalCore
      .connect(this.signers.admin)
      .nextDisputeStatus(1, await this.proposalCore.WAITING_BID())
      .catch(error => error);

    expect(error.message).to.contains("InvalidStatusToUpdate");

    const errorAboutPermission = await this.proposalCore
      .connect(this.signers.third)
      .nextDisputeStatus(1, await this.proposalCore.WAITING_BID())
      .catch(error => error);

    expect(errorAboutPermission.message).to.contains("ForbiddenAccessToMethod");

    const errorAboutNotFound = await this.proposalCore
      .connect(this.signers.admin)
      .nextDisputeStatus(1000, await this.proposalCore.WAITING_BID())
      .catch(error => error);

    expect(errorAboutNotFound.message).to.contains("ProposalNotFound");
  });

  it("should can call on finish proposal", async function () {
    await this.proposalCore.connect(this.signers.admin).setBidContractAddress(this.signers.admin.address);
    await this.proposalCore.connect(this.signers.admin).setDisputeContractAddress(this.signers.other.address);

    await this.proposalCore.connect(this.signers.admin).createProposal("teste", "uma proposta legal", "teste", "00", {
      value: 10,
    });

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.WAITING_BID());

    await this.proposalCore.connect(this.signers.other).onBidderSelected(1);

    expect(await this.proposalCore.getStatusOfProposal(1)).to.equal(await this.proposalCore.IN_DEVELOPMENT());

    await this.proposalCore.connect(this.signers.other).finishProposal(1, this.signers.other.address);

    const error = await this.proposalCore
      .connect(this.signers.admin)
      .finishProposal(1, this.signers.other.address)
      .catch(error => error);

    expect(error.message).to.contains("InvalidStatusToFinish");

    const errorAboutPermission = await this.proposalCore
      .connect(this.signers.third)
      .finishProposal(1, this.signers.other.address)
      .catch(error => error);

    expect(errorAboutPermission.message).to.contains("ForbiddenAccessToMethod");

    const errorAboutNotFound = await this.proposalCore
      .connect(this.signers.admin)
      .finishProposal(1000, this.signers.other.address)
      .catch(error => error);

    expect(errorAboutNotFound.message).to.contains("ProposalNotFound");
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
