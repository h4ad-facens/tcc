//#region Imports

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { DisputeProxy } from '../../models/proxies/dispute.proxy';
import { DisputeService } from '../../services/dispute/dispute.service';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss'],
})
export class DisputeComponent {

  //#region Constructors

  constructor(
    protected readonly navbarService: NavbarService,
    protected readonly disputeService: DisputeService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.DISPUTE);

    [this.disputes$, this.isLoading$, this.loadMore, this.hasMoreData$] = this.disputeService.getPaginatedMyDisputes(8, 'DESC');
  }

  //#endregion

  //#region Public Properties

  public isLoading$: Observable<boolean>;
  public disputes$: Observable<DisputeProxy[]>;
  public loadMore: () => void;
  public hasMoreData$: Observable<boolean>;

  public trackById = (index: number, dispute: DisputeProxy) => dispute.id;

  //#endregion

}
