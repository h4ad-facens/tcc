//#region Imports

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProposalPayload } from '../../models/payloads/proposal.payload';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { BoringPipe } from '../../pipes/boring.pipe';
import { parseEtherToBigNumber } from '../../utils/ether';
import { getPaginatedClosure } from '../../utils/paginated';

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
          { value: parseEtherToBigNumber(payload.amount) },
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

  public async getCountOfMyProposals(): Promise<number> {
    const myAddress = this.web3Service.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3Service.proposalContract.getCountOfProposalsByUser(myAddress).then(count => count.toNumber());
  }

  public async getProposalIdCreatedByMeByIndex(index: number): Promise<number> {
    const myAddress = this.web3Service.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3Service.proposalContract.getProposalIdByUserAndIndex(myAddress, index).then(count => count.toNumber());
  }

  public getPaginatedProposals(itemsPerPage: number, order: 'ASC' | 'DESC'): [data: Observable<ProposalProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    return getPaginatedClosure(
      proposalId => this.getProposalById(proposalId),
      () => this.getCountOfProposals(),
      itemsPerPage,
      order,
    );
  }

  public getPaginatedMyProposals(itemsPerPage: number, order: 'ASC' | 'DESC'): [data: Observable<ProposalProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    return getPaginatedClosure(
      index => this.getProposalIdCreatedByMeByIndex(index - 1).then(proposalId => this.getProposalById(proposalId)),
      () => this.getCountOfMyProposals(),
      itemsPerPage,
      order,
      // basicamente escuta qualquer mudança, e ao logar ou deslogar
      // ele busca novamente os dados.
      this.web3Service.myAddress$.asObservable(),
    );
  }

  public async getProposalById(id: number): Promise<ProposalProxy> {
    return this.web3Service.proposalContract.getProposalById(id)
      .then(proposal => ({
        id,
        description: proposal.description,
        name: proposal.name,
        amount: proposal.amount,
        category: proposal.category,
        contactInfo: proposal.contactInfo,
        status: proposal.status,
        creator: proposal.creator,
        imageUrl: BoringPipe.getSvg(`proposals_${ id }`, 'bauhaus'),
      }));
  }
}
