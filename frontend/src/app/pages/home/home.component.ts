//#region Imports

import { Component } from '@angular/core';
import { randEthereumAddress, randPhrase } from '@ngneat/falso';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

const proposals: ProposalProxy[] = [
  {
    id: 1,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    status: ProposalStatus.WAITING_BID,
    creator: randEthereumAddress(),
  },
  {
    id: 2,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    status: ProposalStatus.WAITING_BID,
    creator: randEthereumAddress(),
  },
  {
    id: 3,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    status: ProposalStatus.WAITING_BID,
    creator: randEthereumAddress(),
  },
  {
    id: 4,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    status: ProposalStatus.WAITING_BID,
    creator: randEthereumAddress(),
  },
  {
    id: 5,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    status: ProposalStatus.WAITING_BID,
    creator: randEthereumAddress(),
  },
];

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

  //#region Public Properties

  public listProposal: ProposalProxy[] = proposals;

  //#endregion

}
