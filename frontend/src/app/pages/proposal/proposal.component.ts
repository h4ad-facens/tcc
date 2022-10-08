//#region Imports

import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { createMockProposal, ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-proposal-shoot',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent implements OnInit {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.PROPOSAL);
  }

  //#endregion

  //#region Public Properties

  public listProposal: ProposalProxy[] = [
    createMockProposal(1, ProposalStatus.IN_DEVELOPMENT),
    createMockProposal(2, ProposalStatus.WAITING_BID),
  ];

  //#endregion

  //#region Public Functions

  public ngOnInit(): void {
    const proposal = localStorage.getItem(environment.keys.proposal);

    if (proposal) {
      this.listProposal.push(JSON.parse(proposal));
      localStorage.removeItem(environment.keys.proposal);
    }
  }

  //#endregion

}
