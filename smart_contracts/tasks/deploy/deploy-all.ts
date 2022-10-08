import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { deployBidCore } from "./bid-core";
import { deployDisputeCore } from "./dispute-core";
import { deployProposalCore } from "./proposal-core";

task("deploy").setAction(async function (taskArguments: TaskArguments, args) {
  const [admin]: SignerWithAddress[] = await args.ethers.getSigners();

  const proposalContract = await deployProposalCore(args);
  const bidContract = await deployBidCore(proposalContract.address, args);
  const disputeContract = await deployDisputeCore(proposalContract.address, bidContract.address, args);

  await proposalContract.connect(admin).setBidContractAddress(bidContract.address);
  await proposalContract.connect(admin).setDisputeContractAddress(disputeContract.address);
});
