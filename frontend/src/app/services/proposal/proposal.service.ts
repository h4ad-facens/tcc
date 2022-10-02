//#region Imports

import { Injectable } from "@angular/core";
import { ProposalPayload } from "../../models/payloads/proposal.payload";
import { Web3Service } from "../../modules/web3/services/web3.service";
import { ethers } from 'ethers';
import { ProposalProxy } from "../../models/proxies/proposal.proxy";

//#endregion

@Injectable({
  providedIn: 'root',
})
export class ProposalService {

  constructor(
    private readonly web3Service: Web3Service,
  ) { }

  public async createProposal(payload: ProposalPayload): Promise<void> {
    await this.web3Service.proposalContract.createProposal(
      payload.title,
      payload.description,
      payload.category,
      payload.contact,
      { value: ethers.utils.parseEther(payload.price + 'eth') }
    );
  }

  public async listProposals(): Promise<ProposalProxy[]> {
    const count = +await this.web3Service.proposalContract.getCountOfProposals();

    const proposals: ProposalProxy[] = [];
    for (let i = 1; i <= count; i++) {
      const proposal = await this.web3Service.proposalContract.getProposalById(count);
      const proxy: ProposalProxy = {
        id: i,
        description: proposal.description,
        title: proposal.name,
        price: +proposal.amount,
        category: proposal.category,
        contact: proposal.contactInfo,
        disputeStatus: +proposal.status,
      };

      proposals.push(proxy);
    }

    return proposals;
  }

}