//#region Imports

import { Component } from '@angular/core';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.PROPOSAL);
  }

  //#endregion

}
