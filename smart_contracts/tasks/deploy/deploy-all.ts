import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { deployBidCore } from "./bid-core";
import { deployProposalCore } from "./proposal-core";

task("deploy").setAction(async function (taskArguments: TaskArguments, args) {
  const proposalContractAddress = await deployProposalCore(args);

  await deployBidCore(proposalContractAddress, args);
});
