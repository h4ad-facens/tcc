//#region Imports

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalPayload } from '../../models/payloads/proposal.payload';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ProposalService } from '../../services/proposal/proposal.service';

//#endregion

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalComponent {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
    private readonly router: Router,
    private readonly proposalService: ProposalService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.PROPOSAL);
  }

  //#endregion

  //#region Public Properties

  public proposal: ProposalPayload = {
    title: '',
    description: '',
    category: '',
    contact: '',
    imageUrl: '',
  };

  public imageBaseUrl: string = environment.imageBaseUrl;

  //#endregion

  //#region Public Functions

  public async createProposal(): Promise<void> {
    localStorage.setItem(environment.keys.proposal, JSON.stringify(this.proposal));
    await this.proposalService.createProposal(this.proposal);
    await this.router.navigateByUrl('/proposal');
  }

  //#endregion

}
