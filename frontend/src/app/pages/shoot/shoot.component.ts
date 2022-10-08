//#region Imports

import { Component } from '@angular/core';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { createMockProposal, ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-shoot',
  templateUrl: './shoot.component.html',
  styleUrls: ['./shoot.component.scss'],
})
export class ShootComponent {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.SHOOT);
  }

  //#endregion

  //#region Public Properties

  public listProposal: ProposalProxy[] = [
    createMockProposal(1, ProposalStatus.WAITING_BID),
    createMockProposal(2, ProposalStatus.IN_DISPUTE_DISTRIBUTION),
    createMockProposal(3, ProposalStatus.FINISHED),
  ];

  //#endregion

}
