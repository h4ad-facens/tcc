//#region Imports

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ethers } from 'ethers';
import { combineLatest, firstValueFrom, lastValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { BidProxy } from '../../models/proxies/bid.proxy';
import { DisputeProxy } from '../../models/proxies/dispute.proxy';
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
    protected readonly fb: FormBuilder,
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

    this.canPerformBasicActions$ = this.proposal$
      .pipe(
        map(proposal => [ProposalStatus.FINISHED, ProposalStatus.WAITING_BID, ProposalStatus.IN_DEVELOPMENT, ProposalStatus.CANCELLED].includes(proposal.status)),
      );

    this.dispute$ = this.disputeService.getDisputeByProposalId$(this.proposalId);

    this.canSelectMediator$ = combineLatest([this.proposal$, this.dispute$, this.web3.myAddress$])
      .pipe(
        map(([proposal, dispute, myAddress]) => !!dispute && !!myAddress && (dispute.bidderAddress === myAddress || dispute.proposalCreatorAddress === myAddress) && proposal.status === ProposalStatus.IN_DISPUTE),
      );

    this.canSelectDistribution$ = combineLatest([this.proposal$, this.dispute$, this.web3.myAddress$])
      .pipe(
        map(([proposal, dispute, myAddress]) => !!dispute && !!myAddress && dispute.mediatorAddress === myAddress && proposal.status === ProposalStatus.IN_DISPUTE_DISTRIBUTION),
      );

    this.selectedPendingMediator$ = this.dispute$
      .pipe(
        switchMap(dispute => dispute ? this.disputeService.getMySelectedMediatorAddressForDisputeId$(dispute.id) : of(null)),
        tap(selectedMediator => selectedMediator && this.formGroupForMediator.controls['mediator'].setValue(selectedMediator)),
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

  public readonly canPerformBasicActions$: Observable<boolean>;
  public readonly canSelectMediator$: Observable<boolean>;
  public readonly canSelectDistribution$: Observable<boolean>;
  public readonly dispute$: Observable<DisputeProxy | null>;
  public readonly selectedPendingMediator$: Observable<string | null>;

  public readonly formGroupForMediator: FormGroup = this.fb.group({
    mediator: ['', [Validators.required]],
  });

  public readonly formGroupForDistribution: FormGroup = this.fb.group({
    splitBidderShare: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

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

  public async selectMediator(): Promise<void> {
    this.errorMessageOnButtons = '';

    const mediatorAddress = this.formGroupForMediator.getRawValue().mediator;

    if (!ethers.utils.isAddress(mediatorAddress)) {
      this.errorMessageOnButtons = 'O enderenço do mediator não é válido.';
      return;
    }

    this.isPerformingActionOnButtons = true;

    const [, errorMessage] = await this.disputeService.selectMediator(this.proposalId, mediatorAddress);

    this.isPerformingActionOnButtons = false;
    this.errorMessageOnButtons = errorMessage;
  }

  public async selectDistribution(): Promise<void> {
    this.isPerformingActionOnButtons = true;

    const splitBidderShare = this.formGroupForDistribution.getRawValue().splitBidderShare;
    const [, errorMessage] = await this.disputeService.selectDistributionForProposalId(this.proposalId, splitBidderShare);

    this.isPerformingActionOnButtons = false;
    this.errorMessageOnButtons = errorMessage;
  }

  //#endregion

}
