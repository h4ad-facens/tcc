//#region Imports

import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BidProxy } from '../../models/proxies/bid.proxy';
import { ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { BidService } from '../../services/bid/bid.service';
import { ProposalService } from '../../services/proposal/proposal.service';

//#endregion

@Component({
  selector: 'app-bid-item',
  templateUrl: './bid-item.component.html',
  styleUrls: ['./bid-item.component.scss'],
})
export class BidItemComponent implements AfterViewInit {

  //#region Constructor

  constructor(
    protected readonly web3: Web3Service,
    protected readonly bidService: BidService,
    protected readonly proposalService: ProposalService,
  ) {
    this.myAddress$ = this.web3.myAddress$;
  }

  //#endregion

  //#region Public Properties

  @Input()
  public bid!: BidProxy;

  @Input()
  public selectedBid: boolean = false;

  @Input()
  public disableButtons!: boolean;

  @Output()
  public onError: EventEmitter<string> = new EventEmitter<string>();

  public proposalStatus: typeof ProposalStatus = ProposalStatus;

  public proposal$?: Observable<ProposalProxy>;

  public readonly myAddress$: Observable<string | null>;

  //#endregion

  //#region LifeCycle Events

  public ngAfterViewInit(): void {
    this.proposal$ = this.proposalService.getProposalById$(this.bid.proposalId);
  }

  //#endregion

  //#region Public Methods

  public async cancelBid(bid: BidProxy, btnDelete: HTMLButtonElement): Promise<void> {
    btnDelete.disabled = true;

    const [isSuccess, errorMessage] = await this.bidService.cancelBidForProposal(bid.id, bid.proposalId);

    btnDelete.disabled = false;

    if (isSuccess)
      return;

    this.onError.emit(errorMessage);
  }

  public async selectBid(bid: BidProxy, btnSelect: HTMLButtonElement): Promise<void> {
    btnSelect.disabled = true;

    const [isSuccess, errorMessage] = await this.bidService.selectBidForProposal(bid.id, bid.proposalId);

    btnSelect.disabled = false;

    if (isSuccess)
      return;

    this.onError.emit(errorMessage);
  }

  //#endregion

}
