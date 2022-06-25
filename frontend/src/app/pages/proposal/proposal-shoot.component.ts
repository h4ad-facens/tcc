//#region Imports

import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalShootComponent implements OnInit {

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
      id: 1,
      title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
      description: '',
      category: '',
      contact: '',
      price: 400,
      imageUrl: '',
    },
    {
      id: 2,
      title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
      description: '',
      category: '',
      contact: '',
      price: 400,
      imageUrl: '',
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
