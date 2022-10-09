//#region Imports

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BidProxy } from '../../models/proxies/bid.proxy';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { ProposalService } from '../../services/proposal/proposal.service';

//#endregion

@Component({
  selector: 'app-bid-card',
  templateUrl: './bid-card.component.html',
  styleUrls: ['./bid-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidCardComponent implements AfterViewInit {

  //#region Constructor

  constructor(
    protected readonly proposalService: ProposalService,
    protected readonly changes: ChangeDetectorRef,
  ) {
  }

  //#endregion

  //#region Public Properties

  @Input()
  public bid!: BidProxy;

  public imageBaseUrl: string = environment.imageBaseUrl;

  public proposal$?: Observable<ProposalProxy | undefined>;

  //#endregion

  //#region LifeCycle Events

  public ngAfterViewInit(): void {
    this.proposal$ = this.proposalService.getProposalById$(this.bid.proposalId);

    this.changes.markForCheck();
  }

  //#endregion

}
