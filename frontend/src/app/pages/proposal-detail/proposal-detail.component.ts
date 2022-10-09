//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { BidProxy } from '../../models/proxies/bid.proxy';
import { ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { BidService } from '../../services/bid/bid.service';
import { DisputeService } from '../../services/dispute/dispute.service';
import { ProposalService } from '../../services/proposal/proposal.service';

//#endregion

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss'],
})
export class ProposalDetailComponent {

  //#region Constructor

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly web3: Web3Service,
    protected readonly proposalService: ProposalService,
    protected readonly bidService: BidService,
    protected readonly disputeService: DisputeService,
  ) {
    this.proposalId = Number(this.route.snapshot.params['id'] || 0);
    this.proposal$ = this.proposalService.getProposalById$(this.proposalId);

    [this.bids$, this.isLoadingBids$, this.loadMoreBids, this.hasMoreBids$] = this.bidService.getPaginatedBidsByProposalId(this.proposalId, 12, 'DESC');

    this.myBids$ = this.bidService.getMyBidsByProposalId$(this.proposalId);

    this.cannotCreateBid$ = this.myBids$.pipe(
      map(bids => bids.length > 0 && bids.some(bid => !bid.isCancelled)),
    );

    this.isWaitingBid$ = this.proposal$.pipe(
      map(proposal => proposal.status === ProposalStatus.WAITING_BID),
    );

    this.canCancelProposal$ = combineLatest([this.proposal$, this.web3.myAddress$])
      .pipe(
        map(([proposal, myAddress]) => proposal.creator === myAddress && proposal.status === ProposalStatus.WAITING_BID),
      );

    this.selectedBid$ = this.bidService.getSelectedBidByProposalId$(this.proposalId);

    this.canSendPayment$ = combineLatest([this.selectedBid$, this.proposal$, this.web3.myAddress$])
      .pipe(
        map(([selectedBid, proposal, myAddress]) => selectedBid && proposal.status === ProposalStatus.IN_DEVELOPMENT && proposal.creator === myAddress),
      );

    this.canEnterInDispute$ = combineLatest([this.selectedBid$, this.proposal$, this.web3.myAddress$])
      .pipe(
        map(([selectedBid, proposal, myAddress]) => selectedBid && !!myAddress && proposal.status === ProposalStatus.IN_DEVELOPMENT),
      );
  }

  //#endregion

  //#region Public Properties

  public readonly proposalId: number;
  public readonly proposal$: Observable<ProposalProxy>;
  public readonly selectedBid$?: Observable<BidProxy>;

  public readonly isWaitingBid$: Observable<boolean>;

  public readonly cannotCreateBid$: Observable<boolean>;

  public readonly myBids$: Observable<BidProxy[]>;

  public readonly bids$: Observable<BidProxy[]>;
  public readonly isLoadingBids$: Observable<boolean>;
  public readonly loadMoreBids: () => void;
  public readonly hasMoreBids$: Observable<boolean>;

  public readonly canCancelProposal$: Observable<boolean>;
  public readonly canSendPayment$: Observable<boolean>;
  public readonly canEnterInDispute$: Observable<boolean>;

  public isPerformingActionOnButtons: boolean = false;

  public errorMessageOnButtons?: string;
  public errorMessageOnCancelBid?: string;

  //#endregion

  //#region Public Functions

  public async createBid(): Promise<void> {
    this.isPerformingActionOnButtons = true;

    const [, errorMessage] = await this.bidService.createBidForProposalId(this.proposalId);

    this.isPerformingActionOnButtons = false;
    this.errorMessageOnButtons = errorMessage;
  }

  public async cancelProposal(): Promise<void> {
    this.isPerformingActionOnButtons = true;

    const [, errorMessage] = await this.proposalService.cancelProposal(this.proposalId);

    this.isPerformingActionOnButtons = false;
    this.errorMessageOnButtons = errorMessage;
  }

  public async sendPayment(): Promise<void> {
    this.isPerformingActionOnButtons = true;

    const [, errorMessage] = await this.bidService.sendPayment(this.proposalId);

    this.isPerformingActionOnButtons = false;
    this.errorMessageOnButtons = errorMessage;
  }

  public async enterInDispute(): Promise<void> {
    this.isPerformingActionOnButtons = true;

    const [, errorMessage] = await this.disputeService.enterInDispute(this.proposalId);

    this.isPerformingActionOnButtons = false;
    this.errorMessageOnButtons = errorMessage;
  }

  //#endregion

}
