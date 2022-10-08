//#region Imports

import { Component } from '@angular/core';
import { randPhrase } from '@ngneat/falso';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss'],
})
export class DisputeComponent {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.DISPUTE);
  }

  //#endregion

  //#region Public Properties

  public choosingProposal: ProposalProxy = {
    id: 1,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    creator: '',
    status: ProposalStatus.WAITING_BID,
  };

  public awaitingProposal: ProposalProxy = {
    id: 2,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    creator: '',
    status: ProposalStatus.IN_DEVELOPMENT,
  };

  public finishedProposal: ProposalProxy = {
    id: 3,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    creator: '',
    status: ProposalStatus.FINISHED,
  };

  public distributeProposal: ProposalProxy = {
    id: 3,
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randPhrase(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    creator: '',
    status: ProposalStatus.IN_DISPUTE,
  };

  //#endregion

}
