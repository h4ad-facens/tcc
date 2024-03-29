import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { combineLatest, filter, from, map, merge, mergeMap, Observable, repeat, Subject, switchMap } from 'rxjs';
import { DisputeProxy } from '../../models/proxies/dispute.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { getPaginatedClosure, PaginatedOrder } from '../../utils/paginated';

@Injectable({
  providedIn: 'root',
})
export class DisputeService {

  //#region Constructor

  constructor(
    protected readonly web3: Web3Service,
  ) {
    this.web3.web3Provider$.subscribe(provider => {
      if (!provider)
        return;

      provider.once('block', () => {
        this.web3.disputeContract.on(this.web3.disputeContract.filters.Created(), (id) => {
          this.getDisputeById(id.toNumber()).then(
            dispute => this.onCreateDispute.next(dispute),
          );
        });

        this.web3.disputeContract.on(this.web3.disputeContract.filters.MediatorSelected(), (id) => {
          this.getDisputeById(id.toNumber()).then(
            dispute => this.onUpdateDispute.next(dispute),
          );
        });

        this.web3.disputeContract.on(this.web3.disputeContract.filters.DistribuitionDefined(), (id) => {
          this.getDisputeById(id.toNumber()).then(
            dispute => this.onUpdateDispute.next(dispute),
          );
        });
      });
    });
  }

  //#endregion

  //#region Protected Properties

  protected readonly onCreateDispute: Subject<DisputeProxy> = new Subject();
  protected readonly onUpdateDispute: Subject<DisputeProxy> = new Subject();

  //#endregion

  //#region Public Methods

  public getPaginatedMyDisputes(itemsPerPage: number, order: PaginatedOrder): [data: Observable<DisputeProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    return getPaginatedClosure({
      getById: index => this.getDisputeIdCreatedByMeByIndex(index - 1).then(proposalId => this.getDisputeById(proposalId)),
      getCount: () => this.getCountOfMyDisputes(),
      itemsPerPage,
      order,
      // basicamente escuta qualquer mudança, e ao logar ou deslogar
      // ele busca novamente os dados.
      refreshAllWhen: this.web3.myAddress$.asObservable(),
      onAddData: combineLatest([this.onCreateDispute, this.web3.myAddress$])
        .pipe(
          filter(([dispute, myAddress]) => !!myAddress && [dispute.bidderAddress, dispute.proposalCreatorAddress, dispute.mediatorAddress].includes(myAddress)),
          map(([dispute]) => dispute),
        ),
      onUpdateData: combineLatest([this.onUpdateDispute, this.web3.myAddress$])
        .pipe(
          filter(([dispute, myAddress]) => !!myAddress && [dispute.bidderAddress, dispute.proposalCreatorAddress, dispute.mediatorAddress].includes(myAddress)),
          map(([dispute]) => dispute),
        ),
    });
  }

  public async enterInDispute(proposalId: number): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar entrar em disputa em uma proposta.');

      const transaction = await this.web3.disputeContract
        .connect(currentSigner)
        .createDispute(
          proposalId,
        );

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, `Ocorreu um erro ao tentar entrar em disputa com essa proposta: ${ e.message }`];
    }
  }

  public async selectMediator(proposalId: number, mediator: string): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar selecionar um mediador.');

      const disputeId = await this.getDisputeIdByProposalId(proposalId);

      const transaction = await this.web3.disputeContract
        .connect(currentSigner)
        .selectMediator(
          disputeId,
          mediator,
        );

      const receipt = await transaction.wait();

      await this.getDisputeById(disputeId).then(dispute => {
        this.onUpdateDispute.next(dispute);
      });

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, `Ocorreu um erro ao tentar selecionar um mediador: ${ e.message }`];
    }
  }

  public async selectDistributionForProposalId(proposalId: number, splitBidderShare: number): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar selecionar a distribuição.');

      const disputeId = await this.getDisputeIdByProposalId(proposalId);

      const transaction = await this.web3.disputeContract
        .connect(currentSigner)
        .selectDistribution(
          disputeId,
          splitBidderShare,
        );

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, `Ocorreu um erro ao tentar selecionar a distribuição: ${ e.message }`];
    }
  }

  public getDisputeByProposalId$(proposalId: number): Observable<DisputeProxy | null> {
    const onCreateDisputeForProposal$ = this.onCreateDispute
      .pipe(
        filter(dispute => dispute.proposalId === proposalId),
      );

    const onUpdateDisputeForProposal$ = this.onUpdateDispute
      .pipe(
        filter(dispute => dispute.proposalId === proposalId),
      );

    const getFromBlockchain$ = from(
      this.getDisputeIdByProposalId(proposalId),
    ).pipe(
      filter(v => v > 0),
      mergeMap((disputeId) => this.getDisputeById$(disputeId)),
    );

    return merge(getFromBlockchain$, onCreateDisputeForProposal$, onUpdateDisputeForProposal$);
  }

  public getDisputeById$(id: number): Observable<DisputeProxy> {
    const onUpdateDisputeForProposal$ = this.onUpdateDispute
      .pipe(
        filter(dispute => dispute.id === id),
      );

    const getDisputeFromBlockchain$ = from(
      this.getDisputeById(id),
    );

    return merge(getDisputeFromBlockchain$, onUpdateDisputeForProposal$);
  }

  public getMySelectedMediatorAddressForDisputeId$(disputeId: number): Observable<string | null> {
    const onUpdateDispute = this.onUpdateDispute
      .pipe(
        filter(dispute => dispute.id === disputeId),
      );

    return this.web3.myAddress$
      .pipe(
        repeat({
          delay: () => onUpdateDispute,
        }),
        switchMap((myAddress) => from(this.getMySelectedMediatorByDisputeId(myAddress, disputeId))),
      );
  }

  //#endregion

  //#region Protected Methods

  protected async getDisputeById(id: number): Promise<DisputeProxy> {
    return this.web3.disputeContract.getDisputeById(id).then(dispute => ({
      id,
      bidId: dispute.bidId.toNumber(),
      splitBidderShare: dispute.splitBidderShare,
      proposalCreatorAddress: dispute.proposalCreatorAddress,
      createdByBidder: dispute.createdByBidder,
      mediatorAddress: dispute.mediatorAddress === ethers.constants.AddressZero ? null : dispute.mediatorAddress,
      distributedAt: dispute.distributedAt.toNumber() === 0 ? null : new Date(dispute.distributedAt.toNumber() * 1000),
      proposalId: dispute.proposalId.toNumber(),
      bidderAddress: dispute.bidderAddress,
      createdAt: new Date(dispute.createdAt.toNumber() * 1000),
    }));
  }

  protected async getDisputeIdByProposalId(proposalId: number): Promise<number> {
    return await this.web3.disputeContract.getDisputeIdByProposalId(proposalId).then(n => n.toNumber()).catch(() => 0);
  }

  protected async getMySelectedMediatorByDisputeId(userAddress: string | null, disputeId: number): Promise<string | null> {
    if (!userAddress)
      return null;

    return this.web3.disputeContract.getPendingSelectedMediatorByUserAddressAndDisputeId(userAddress, disputeId);
  }

  protected async getCountOfMyDisputes(): Promise<number> {
    const myAddress = this.web3.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3.disputeContract.getCountOfDisputesByUser(myAddress).then(count => count.toNumber());
  }

  protected async getDisputeIdCreatedByMeByIndex(index: number): Promise<number> {
    const myAddress = this.web3.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3.disputeContract.getDisputeIdByUserAddressAndIndex(myAddress, index).then(count => count.toNumber());
  }

  //#endregion

}
