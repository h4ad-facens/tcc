//#region Imports

import { Component } from '@angular/core';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.HELP);
  }

  //#endregion

}
