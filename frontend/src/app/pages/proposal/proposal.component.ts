//#region Imports

import { Component, OnInit } from '@angular/core';
import { randPhrase } from '@ngneat/falso';
import { environment } from '../../../environments/environment';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-proposal-shoot',
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

  public listProposal: ProposalProxy[] = [
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
      shootAccepted: true,
    },
  ];

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
