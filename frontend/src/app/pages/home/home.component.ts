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
  },
  {
    id: 4,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 5,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 6,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 7,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 8,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 9,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 10,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 11,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 12,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 13,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 14,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  },
  {
    id: 15,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
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
