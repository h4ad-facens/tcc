import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("deploy").setAction(async function (taskArguments: TaskArguments, args) {
  await deployBidCore(taskArguments.address, args);
});

export async function deployBidCore(
  proposalContractAddress: string,
  { ethers }: HardhatRuntimeEnvironment,
): Promise<string> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const bidFactory = await ethers.getContractFactory("BidCore");
  const bid = await bidFactory.connect(signers[0]).deploy(proposalContractAddress);
  await bid.deployed();

  console.log("BidCore deployed to: ", bid.address);

  return bid.address;
}
