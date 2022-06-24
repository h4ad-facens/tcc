//#region Imports

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalPayload } from '../../models/payloads/proposal.payload';
import { NavbarService } from '../../services/navbar/navbar.service';

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
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.PROPOSAL);
  }

  //#endregion

  //#region Public Properties

  public proposal: ProposalPayload = {
    title: '',
    description: '',
    price: 0,
    category: '',
    contact: '',
    imageUrl: '',
  };

  //#endregion

  //#region Public Functions

  public async createProposal(): Promise<void> {
    localStorage.setItem(environment.keys.proposal, JSON.stringify(this.proposal));
    await this.router.navigateByUrl('/proposal');
  }

  //#endregion

}
