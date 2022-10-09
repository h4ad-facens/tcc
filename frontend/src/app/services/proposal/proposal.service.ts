//#region Imports

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ProposalPayload } from '../../models/payloads/proposal.payload';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { BoringPipe } from '../../pipes/boring.pipe';
import { parseEtherToBigNumber } from '../../utils/ether';
import { getPaginatedClosure, PaginatedOrder } from '../../utils/paginated';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class ProposalService {

  constructor(
    private readonly web3: Web3Service,
  ) {
    // TODO: Adicionar lógica para atualizar a lista de propostas caso eu crie/atualize uma
  }

  public async createProposal(payload: ProposalPayload): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar criar uma proposta.');

      const transaction = await this.web3.proposalContract
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
    return this.web3.proposalContract.getCountOfProposals().then(count => count.toNumber());
  }

  public async getCountOfMyProposals(): Promise<number> {
    const myAddress = this.web3.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3.proposalContract.getCountOfProposalsByUser(myAddress).then(count => count.toNumber());
  }

  public async getProposalIdCreatedByMeByIndex(index: number): Promise<number> {
    const myAddress = this.web3.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3.proposalContract.getProposalIdByUserAndIndex(myAddress, index).then(count => count.toNumber());
  }

  public getPaginatedProposals(itemsPerPage: number, order: PaginatedOrder): [data: Observable<ProposalProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    return getPaginatedClosure({
      getById: proposalId => this.getProposalById(proposalId),
      getCount: () => this.getCountOfProposals(),
      itemsPerPage,
      order,
    });
  }

  public getPaginatedMyProposals(itemsPerPage: number, order: PaginatedOrder): [data: Observable<ProposalProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    return getPaginatedClosure({
      getById: index => this.getProposalIdCreatedByMeByIndex(index - 1).then(proposalId => this.getProposalById(proposalId)),
      getCount: () => this.getCountOfMyProposals(),
      itemsPerPage,
      order,
      // basicamente escuta qualquer mudança, e ao logar ou deslogar
      // ele busca novamente os dados.
      refreshAllWhen: this.web3.myAddress$.asObservable(),
    });
  }

  public async getProposalById(id: number): Promise<ProposalProxy> {
    return this.web3.proposalContract.getProposalById(id)
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

  public getProposalById$(id: number): Observable<ProposalProxy> {
    return from(
      this.getProposalById(id),
    );
  }
}
