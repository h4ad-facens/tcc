import { Injectable } from '@angular/core';
import { BehaviorSubject, concatAll, filter, finalize, firstValueFrom, from, lastValueFrom, map, merge, mergeMap, Observable, Subject, switchMap } from 'rxjs';
import { BidProxy } from '../../models/proxies/bid.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { getPaginatedClosure, PaginatedOrder } from '../../utils/paginated';
import { ProposalService } from '../proposal/proposal.service';

@Injectable({
  providedIn: 'root',
})
export class BidService {

  //#region Constructor

  constructor(
    protected readonly web3: Web3Service,
    protected readonly proposal: ProposalService,
  ) {
    this.web3.web3Provider$.subscribe(provider => {
      if (!provider)
        return;

      provider.once('block', () => {
        this.web3.bidContract.on(this.web3.bidContract.filters.Created(), (id) => {
          this.getBidById(id.toNumber()).then(
            bid => this.onCreateBid.next(bid),
          );
        });

        this.web3.bidContract.on(this.web3.bidContract.filters.Cancelled(), (id) => {
          this.getBidById(id.toNumber()).then(
            bid => this.onCancelBid.next(bid),
          );
        });

        this.web3.bidContract.on(this.web3.bidContract.filters.Selected(), (id) => {
          this.getBidById(id.toNumber()).then(
            bid => this.onSelectBid.next(bid),
          );
        });
      });
    });
  }

  //#endregion

  //#region Protected Properties

  protected readonly onCreateBid: Subject<BidProxy> = new Subject();
  protected readonly onCancelBid: Subject<BidProxy> = new Subject();
  protected readonly onSelectBid: Subject<BidProxy> = new Subject();

  //#endregion

  //#region Public Methods

  public getPaginatedBidsByProposalId(proposalId: number, itemsPerPage: number, order: PaginatedOrder): [data$: Observable<BidProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    return getPaginatedClosure({
      getById: index => this.getBidIdByProposalIdAndIndex(proposalId, index - 1).then(bidProxy => this.getBidById(bidProxy)),
      getCount: () => this.getCountOfBidsByProposalId(proposalId),
      itemsPerPage,
      order,
      onAddData: this.onCreateBid.asObservable(),
      onUpdateData: merge([this.onCancelBid.asObservable(), this.onSelectBid.asObservable()])
        .pipe(
          concatAll(),
        ),
    });
  }

  public getPaginatedMyBids(itemsPerPage: number, order: PaginatedOrder): [data$: Observable<BidProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    return getPaginatedClosure({
      getById: index => this.getMyBidIdByIndex(index - 1).then(bidProxy => this.getBidById(bidProxy)),
      getCount: () => this.getCountOfMyBids(),
      itemsPerPage,
      order,
      refreshAllWhen: this.web3.myAddress$.asObservable(),
      onAddData: this.onCreateBid
        .pipe(
          filter(bid => bid.bidderAddress === this.web3.myAddress$.getValue()),
        ),
      onUpdateData: merge([
        this.onCancelBid
          .pipe(
            filter(bid => bid.bidderAddress === this.web3.myAddress$.getValue()),
          ),
        this.onSelectBid
          .pipe(
            filter(bid => bid.bidderAddress === this.web3.myAddress$.getValue()),
          ),
        this.onSelectBid
          .pipe(
            filter(bid => bid.bidderAddress === this.web3.myAddress$.getValue()),
          ),
      ])
        .pipe(
          concatAll(),
        ),
    });
  }

  public getMyBidsByProposalId$(proposalId: number): Observable<BidProxy[]> {
    const myBids = new BehaviorSubject<BidProxy[]>([]);

    const onAddBidSubscription = this.onCreateBid.pipe(
      filter(bid => bid.proposalId === proposalId && bid.bidderAddress === this.web3.myAddress$.getValue()),
    ).subscribe((bid) => {
      myBids.next([...myBids.getValue(), bid]);
    });

    const onChangeBidSubscription =
      merge([this.onCancelBid, this.onSelectBid])
        .pipe(
          concatAll(),
          filter(bid => bid.proposalId === proposalId && bid.bidderAddress === this.web3.myAddress$.getValue()),
        ).subscribe((bid) => {
        const currentBids = myBids.getValue();
        const oldDataIndex = currentBids.findIndex(old => old.id === bid.id);

        if (oldDataIndex === -1)
          return;

        currentBids[oldDataIndex] = bid;

        myBids.next([...currentBids]);
      });

    const onGetMyAddressSubscription = this.web3.myAddress$
      .pipe(
        filter(myAddress => !!myAddress),
        mergeMap(myAddress => {
          const filter = this.web3.bidContract.filters.Created(null, proposalId, myAddress);
          const queryFilter = this.web3.bidContract.queryFilter(filter);

          return from(
            queryFilter
              .then(events => Promise.all(
                events.map(event => this.getBidById(event.args.id.toNumber())),
              )),
          );
        }),
      ).subscribe(bids => {
        myBids.next([...bids]);
      });

    return myBids
      .pipe(
        finalize(() => {
          onGetMyAddressSubscription.unsubscribe();

          onAddBidSubscription.unsubscribe();
          onChangeBidSubscription.unsubscribe();
        }),
      );
  }

  public getBidById$(id: number): Observable<BidProxy> {
    return from(
      this.getBidById(id),
    );
  }

  public getSelectedBidByProposalId$(proposalId: number): Observable<BidProxy> {
    const selectedBidId$ = from(
      this.getSelectedBidIdByProposalId(proposalId),
    );

    const onSelectBid$ = this.onSelectBid.pipe(
      filter(bid => bid.proposalId === proposalId),
      map(bid => bid.id),
    );

    return merge([selectedBidId$, onSelectBid$])
      .pipe(
        concatAll(),
        filter(id => id > 0),
        switchMap(id => this.getBidById$(id)),
      );
  }

  public async createBidForProposalId(proposalId: number): Promise<[boolean, string?]> {
    try {
      const signer = this.web3.signer$.getValue();

      if (!signer)
        throw new Error('Você precisa estar conectado com a sua carteira para dar um lance.');

      const bidShareToParticipate = await this.web3.bidContract.BID_SHARE_TO_PARTICIPATE();
      const proposal = await firstValueFrom(this.proposal.getProposalById$(proposalId));

      if (!proposal)
        throw new Error('Não foi possível encontrar a proposta com essa identificação.');

      const transaction = await this.web3.bidContract
        .connect(signer)
        .createBid(proposalId, {
          value: proposal.amount.div(bidShareToParticipate),
        });

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, e.message];
    }
  }

  public async cancelBidForProposal(bidId: number, proposalId: number): Promise<[boolean, string?]> {
    try {
      const signer = this.web3.signer$.getValue();

      if (!signer)
        throw new Error('Você precisa estar conectado com a sua carteira para dar um lance.');

      const transaction = await this.web3.bidContract
        .connect(signer)
        .cancelBid(proposalId, bidId);

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, e.message];
    }
  }

  public async selectBidForProposal(bidId: number, proposalId: number): Promise<[boolean, string?]> {
    try {
      const signer = this.web3.signer$.getValue();

      if (!signer)
        throw new Error('Você precisa estar conectado com a sua carteira para dar um lance.');

      const transaction = await this.web3.bidContract
        .connect(signer)
        .selectBid(proposalId, bidId);

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, e.message];
    }
  }

  public async sendPayment(proposalId: number): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar enviar o pagamento de uma proposta.');

      const transaction = await this.web3.bidContract
        .connect(currentSigner)
        .transferPayment(
          proposalId,
        );

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, `Ocorreu um erro ao enviar o pagametno para a proposta: ${ e.message }`];
    }
  }

  //#endregion

  //#region Protected Methods

  protected async getBidById(id: number): Promise<BidProxy> {
    return this.web3.bidContract.getBidById(id).then(bid => ({
      id,
      proposalId: bid.proposalId.toNumber(),
      bidPaidAmount: bid.bidPaidAmount,
      bidderAddress: bid.bidderAddress,
      createdAt: new Date(bid.createdAt.toNumber() * 1000),
      isCancelled: bid.isCancelled,
    }));
  }

  protected async getSelectedBidIdByProposalId(proposalId: number): Promise<number> {
    return this.web3.bidContract.getSelectedBidIdByProposalId(proposalId).then(n => n.toNumber()).catch(() => 0);
  }

  protected async getBidIdByProposalIdAndIndex(proposalId: number, index: number): Promise<number> {
    return this.web3.bidContract.getBidIdByProposalIdAndIndex(proposalId, index).then(n => n.toNumber());
  }

  protected async getCountOfBidsByProposalId(proposalId: number): Promise<number> {
    return this.web3.bidContract.getCountOfBidsByProposalId(proposalId).then(n => n.toNumber());
  }

  protected async getCountOfMyBids(): Promise<number> {
    const myAddress = this.web3.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return await this.web3.bidContract.getCountOfBidsByUser(myAddress).then(n => n.toNumber());
  }

  protected async getMyBidIdByIndex(index: number): Promise<number> {
    const myAddress = this.web3.myAddress$.getValue();

    if (!myAddress)
      return 0;

    return this.web3.bidContract.getBidIdByUserAndIndex(myAddress, index).then(n => n.toNumber());
  }

  //#endregion

}
