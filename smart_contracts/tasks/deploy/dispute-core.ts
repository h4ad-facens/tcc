import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

import { DisputeCore } from "../../src/types/contracts/disputes/DisputeCore";

task("deploy:dispute").setAction(async function (taskArguments: TaskArguments, args) {
  await deployDisputeCore(taskArguments.proposaladdress, taskArguments.bidaddress, args);
});

export async function deployDisputeCore(
  proposalContractAddress: string,
  bidContractAddress: string,
  { ethers }: HardhatRuntimeEnvironment,
): Promise<DisputeCore> {
  const signers: SignerWithAddress[] = await ethers.getSigners();

  const disputeFactory = await ethers.getContractFactory("DisputeCore");
  const dispute = await disputeFactory.connect(signers[0]).deploy(proposalContractAddress, bidContractAddress);
  await dispute.deployed();

  console.log("DisputeCore deployed to: ", dispute.address);

  return dispute;
}
