//#region Imports

import { Component, OnInit } from '@angular/core';
import { randPhrase } from '@ngneat/falso';
import { environment } from '../../../environments/environment';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

const proposals = [
  {
    id: 1,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
  },
  {
    id: 2,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
  },
];

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent implements OnInit {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.PROPOSAL);
  }

  //#endregion

  //#region Public Properties

  public listProposal: ProposalProxy[] = proposals;

  //#endregion

  //#region Public Functions

  public ngOnInit(): void {
    const proposal = localStorage.getItem(environment.keys.proposal);

    if (proposal) {
      this.listProposal.push(JSON.parse(proposal));
      localStorage.removeItem(environment.keys.proposal);
    }
  }

  //#endregion

}
