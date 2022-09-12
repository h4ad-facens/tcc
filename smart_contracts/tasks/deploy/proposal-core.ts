import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("deploy:ProposalCore").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const greeterFactory = await ethers.getContractFactory("ProposalCore");
  const greeter = await greeterFactory.connect(signers[0]).deploy();
  await greeter.deployed();

  console.log("ProposalCore deployed to: ", greeter.address);
});
