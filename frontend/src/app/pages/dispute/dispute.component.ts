//#region Imports

import { Component } from '@angular/core';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
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

}
