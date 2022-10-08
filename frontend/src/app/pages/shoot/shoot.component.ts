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
    status: ProposalStatus.IN_DISPUTE,
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
    status: ProposalStatus.IN_DISPUTE_DISTRIBUTION,
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
    shootAccepted: true,
    status: ProposalStatus.FINISHED,
    creator: randEthereumAddress(),
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
