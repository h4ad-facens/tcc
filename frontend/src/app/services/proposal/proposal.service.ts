//#region Imports

import { Injectable } from '@angular/core';
import { BigNumber } from 'ethers';
import { BigNumberish } from 'ethers/lib/ethers';
import { ProposalPayload } from '../../models/payloads/proposal.payload';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { BoringPipe } from '../../pipes/boring.pipe';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class ProposalService {

  constructor(
    private readonly web3Service: Web3Service,
  ) {
  }

  public async createProposal(payload: ProposalPayload): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3Service.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar criar uma proposta.');

      const transaction = await this.web3Service.proposalContract
        .connect(currentSigner)
        .createProposal(
          payload.name,
          payload.description,
          payload.category,
          payload.contactInfo,
          { value: BigNumber.from(payload.amount).mul(BigNumber.from(10).pow(18)) },
        );

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, `Ocorreu um erro ao criar a proposta: ${ e.message }`];
    }
  }

  public async getCountOfProposals(): Promise<number> {
    return this.web3Service.proposalContract.getCountOfProposals().then(count => count.toNumber());
  }

  public async getProposalById(id: number): Promise<ProposalProxy> {
    return this.web3Service.proposalContract.getProposalById(id)
      .then(proposal => ({
        id,
        description: proposal.description,
        name: proposal.name,
        amount: proposal.amount.toNumber(),
        category: proposal.category,
        contactInfo: proposal.contactInfo,
        status: proposal.status,
        creator: proposal.creator,
        imageUrl: BoringPipe.getSvg(`proposal_${ id }`, 'bauhaus'),
      }));
  }
}
