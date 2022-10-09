//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { ShootProposalStepEnum } from '../../models/enums/shoot-proposal-step.enum';
import { BidProxy } from '../../models/proxies/bid.proxy';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { BidService } from '../../services/bid/bid.service';
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
    protected readonly proposalService: ProposalService,
    protected readonly bidService: BidService,
  ) {
    this.proposalId = Number(this.route.snapshot.params['id'] || 0);
    this.proposal$ = this.proposalService.getProposalById$(this.proposalId);

    [this.bids$, this.isLoadingBids$, this.loadMoreBids, this.hasMoreBids$] = this.bidService.getPaginatedBidsByProposalId(this.proposalId, 12, 'DESC');

    this.myBids$ = this.bidService.getMyBidsForProposal$(this.proposalId);

    this.cannotCreateBid$ = this.myBids$.pipe(
      map(bids => bids.length > 0 && bids.some(bid => !bid.isCancelled)),
    );
  }

  //#endregion

  //#region Public Properties

  public readonly proposalId: number;
  public readonly proposal$: Observable<ProposalProxy>;

  public readonly cannotCreateBid$: Observable<boolean>;

  public readonly myBids$: Observable<BidProxy[]>;

  public readonly bids$: Observable<BidProxy[]>;
  public readonly isLoadingBids$: Observable<boolean>;
  public readonly loadMoreBids: () => void;
  public readonly hasMoreBids$: Observable<boolean>;

  public isCreatingBid: boolean = false;
  public errorMessageOnCreateBid?: string;
  public errorMessageOnCancelBid?: string;

  //#endregion

  //#region Public Functions

  public async createBid(): Promise<void> {
    this.isCreatingBid = true;

    const [, errorMessage] = await this.bidService.createBidForProposalId(this.proposalId);

    this.isCreatingBid = false;
    this.errorMessageOnCreateBid = errorMessage;
  }

  //#endregion

}
