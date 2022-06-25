//#region Imports

import { Component } from '@angular/core';
import { randPhrase } from '@ngneat/falso';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

const proposals = [
  {
    id: 1,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 2,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 3,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
    shootAccepted: true,
  },
];

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

  public listProposal: ProposalProxy[] = proposals;

  //#endregion

}
