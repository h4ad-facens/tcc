//#region Imports

import { Component } from '@angular/core';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
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

}
