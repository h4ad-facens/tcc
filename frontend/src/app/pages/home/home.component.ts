//#region Imports

import { Component } from '@angular/core';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.HOME);
  }

  //#endregion

}
