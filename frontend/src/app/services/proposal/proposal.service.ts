//#region Imports

import { Injectable } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { combineLatest, filter, from, map, Observable, of, repeat, Subject, switchMap } from 'rxjs';
import { ProposalPayload } from '../../models/payloads/proposal.payload';
import { ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { BoringPipe } from '../../pipes/boring.pipe';
import { parseEtherToBigNumber } from '../../utils/ether';
import { getPaginatedClosure, PaginatedOrder } from '../../utils/paginated';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class ProposalService {

  //#region Constructor

  constructor(
    private readonly web3: Web3Service,
  ) {
    this.web3.web3Provider$.subscribe(provider => {
      if (!provider)
        return;

      provider.once('block', () => {
        this.web3.proposalContract.on(this.web3.proposalContract.filters.Created(), (id) => {
          this.getProposalById(id.toNumber()).then(
            proposal => this.onCreateProposal.next(proposal),
          );
        });

        this.web3.proposalContract.on(this.web3.proposalContract.filters.StatusChanged(), (id) => {
          this.getProposalById(id.toNumber()).then(
            proposal => {
              this.onStatusChanged.next(proposal);
            },
          );
        });
      });
    });
  }

  //#endregion

  //#region Protected Properties

  protected readonly onCreateProposal: Subject<ProposalProxy> = new Subject<ProposalProxy>();

  protected readonly onStatusChanged: Subject<ProposalProxy> = new Subject<ProposalProxy>();

  //#endregion

  //#region Public Methods

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

  public async cancelProposal(proposalId: number): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar cancelar uma proposta.');

      const transaction = await this.web3.proposalContract
        .connect(currentSigner)
        .cancelProposal(
          proposalId,
        );

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, `Ocorreu um erro ao cancelar a proposta: ${ e.message }`];
    }
  }

  public getPaginatedProposals(itemsPerPage: number, order: PaginatedOrder): [data: Observable<ProposalProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    return getPaginatedClosure({
      getById: proposalId => this.getProposalById(proposalId),
      getCount: () => this.getCountOfProposals(),
      itemsPerPage,
      order,
      onAddData: this.onCreateProposal.asObservable(),
      onUpdateData: this.onStatusChanged.asObservable(),
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
      onAddData: combineLatest([this.onCreateProposal, this.web3.myAddress$])
        .pipe(
          filter(([proposal, myAddress]) => proposal.creator === myAddress),
          map(([proposal]) => proposal),
        ),
      onUpdateData: combineLatest([this.onStatusChanged, this.web3.myAddress$])
        .pipe(
          filter(([proposal, myAddress]) => proposal.creator === myAddress),
          map(([proposal]) => proposal),
        ),
    });
  }

  public getProposalById$(id: number): Observable<ProposalProxy> {
    return of(null)
      .pipe(
        repeat({
          delay: () => combineLatest([this.onStatusChanged]),
        }),
        switchMap(() => from(this.getProposalById(id))),
      );
  }

  //#endregion

  //#region Protected

  protected async getCountOfProposals(): Promise<number> {
    return this.web3.proposalContract.getCountOfProposals().then(count => count.toNumber());
  }

  protected async getCountOfMyProposals(): Promise<number> {
    const myAddress = this.web3.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3.proposalContract.getCountOfProposalsByUser(myAddress).then(count => count.toNumber());
  }

  protected async getProposalIdCreatedByMeByIndex(index: number): Promise<number> {
    const myAddress = this.web3.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3.proposalContract.getProposalIdByUserAndIndex(myAddress, index).then(count => count.toNumber());
  }

  protected async getProposalById(id: number): Promise<ProposalProxy> {
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

  //#endregion

}
