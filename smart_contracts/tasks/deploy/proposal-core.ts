import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("deploy:ProposalCore").setAction(async function (taskArguments: TaskArguments, args) {
  await deployProposalCore(args);
});

export async function deployProposalCore({ ethers }: HardhatRuntimeEnvironment): Promise<string> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const proposalFactory = await ethers.getContractFactory("ProposalCore");
  const proposal = await proposalFactory.connect(signers[0]).deploy();
  await proposal.deployed();

  console.log("ProposalCore deployed to: ", proposal.address);

  return proposal.address;
}
