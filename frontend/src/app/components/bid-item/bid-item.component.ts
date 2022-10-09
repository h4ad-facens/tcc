//#region Imports

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BidProxy } from '../../models/proxies/bid.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { BidService } from '../../services/bid/bid.service';

//#endregion

@Component({
  selector: 'app-bid-item',
  templateUrl: './bid-item.component.html',
  styleUrls: ['./bid-item.component.scss'],
})
export class BidItemComponent {

  //#region Constructor

  constructor(
    protected readonly web3: Web3Service,
    protected readonly bidService: BidService,
  ) {
    this.myAddress$ = this.web3.myAddress$;
  }

  //#endregion

  //#region Public Properties

  @Input()
  public proposalId!: number;

  @Input()
  public bid!: BidProxy;

  @Input()
  public disableCancel!: boolean;

  @Output() onErrorOnCancel: EventEmitter<string> = new EventEmitter<string>();

  public readonly myAddress$: Observable<string | null>;

  //#endregion

  //#region Public Methods

  public async cancelBid(bid: BidProxy, btnDelete: HTMLButtonElement): Promise<void> {
    btnDelete.disabled = true;

    const [isSuccess, errorMessage] = await this.bidService.cancelBidForProposal(bid.id, this.proposalId);

    btnDelete.disabled = false;

    if (isSuccess)
      return;

    this.onErrorOnCancel.emit(errorMessage);
  }

  //#endregion

}
