//#region Imports

import { Component } from '@angular/core';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { createMockProposal, ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';
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
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.DISPUTE);
  }

  //#endregion

  //#region Public Properties

  public choosingProposal: ProposalProxy = createMockProposal(1, ProposalStatus.WAITING_BID);
  public awaitingProposal: ProposalProxy = createMockProposal(2, ProposalStatus.IN_DEVELOPMENT);
  public finishedProposal: ProposalProxy = createMockProposal(3, ProposalStatus.FINISHED);
  public distributeProposal: ProposalProxy = createMockProposal(4, ProposalStatus.IN_DISPUTE);

  //#endregion

}
