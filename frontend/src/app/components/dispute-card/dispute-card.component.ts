//#region Imports

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { DisputeProxy } from '../../models/proxies/dispute.proxy';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { ProposalService } from '../../services/proposal/proposal.service';

//#endregion

@Component({
  selector: 'app-dispute-card',
  templateUrl: './dispute-card.component.html',
  styleUrls: ['./dispute-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisputeCardComponent implements AfterViewInit {

  //#region Constructor

  constructor(
    protected readonly proposalService: ProposalService,
    protected readonly changes: ChangeDetectorRef,
  ) {
  }

  //#endregion

  //#region Public Properties

  @Input()
  public dispute!: DisputeProxy;

  public proposal$?: Observable<ProposalProxy | undefined>;

  //#endregion

  //#region LifeCycle Events

  public ngAfterViewInit(): void {
    this.proposal$ = this.proposalService.getProposalById$(this.dispute.proposalId);

    this.changes.markForCheck();
  }

  //#endregion

}
