//#region Imports

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ProposalService } from '../../services/proposal/proposal.service';

//#endregion

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  //#region Constructors

  constructor(
    protected readonly navbarService: NavbarService,
    protected readonly proposal: ProposalService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.HOME);

    [this.proposals$, this.isLoading$, this.loadMore, this.hasMoreData$] = this.proposal.getPaginatedProposals(8, 'DESC');
  }

  //#endregion

  //#region Public Properties

  public isLoading$: Observable<boolean>;
  public proposals$: Observable<ProposalProxy[]>;
  public loadMore: () => void;
  public hasMoreData$: Observable<boolean>;

  public trackById = (index: number, proposal: ProposalProxy) => proposal.id;

  //#endregion

}
