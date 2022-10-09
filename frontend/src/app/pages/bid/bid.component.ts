//#region Imports

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { BidProxy } from '../../models/proxies/bid.proxy';
import { BidService } from '../../services/bid/bid.service';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-shoot',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.scss'],
})
export class BidComponent {

  //#region Constructors

  constructor(
    protected readonly navbarService: NavbarService,
    protected readonly bidService: BidService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.SHOOT);

    [this.bids$, this.isLoading$, this.loadMore, this.hasMoreData$] = this.bidService.getPaginatedMyBids(8, 'DESC');
  }

  //#endregion

  //#region Public Properties

  public isLoading$: Observable<boolean>;
  public bids$: Observable<BidProxy[]>;
  public loadMore: () => void;
  public hasMoreData$: Observable<boolean>;

  public trackById = (index: number, proposal: BidProxy) => proposal.id;

  //#endregion

}
