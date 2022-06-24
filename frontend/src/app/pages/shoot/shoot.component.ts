//#region Imports

import { Component } from '@angular/core';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
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
    {
      title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
      description: '',
      category: '',
      contact: '',
      price: 400,
      imageUrl: '',
    },
    {
      title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
      description: '',
      category: '',
      contact: '',
      price: 400,
      imageUrl: '',
    },
    {
      title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
      description: '',
      category: '',
      contact: '',
      price: 400,
      imageUrl: '',
    },
  ];

  //#endregion

}
