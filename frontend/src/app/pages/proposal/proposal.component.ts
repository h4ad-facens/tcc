//#region Imports

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ProposalService } from '../../services/proposal/proposal.service';

//#endregion

@Component({
  selector: 'app-proposal-shoot',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent {

  //#region Constructors

  constructor(
    protected readonly navbarService: NavbarService,
    protected readonly proposal: ProposalService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.PROPOSAL);

    [this.proposals$, this.isLoading$, this.loadMore, this.hasMoreData$] = this.proposal.getPaginatedMyProposals(8, 'ASC');
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
