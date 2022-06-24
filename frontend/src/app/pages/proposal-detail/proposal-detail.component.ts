//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShootProposalStepEnum } from '../../models/enums/shoot-proposal-step.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';

//#endregion

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss'],
})
export class ProposalDetailComponent {

  //#region Constructor

  constructor(
    private readonly route: ActivatedRoute,
  ) {
    this.proposal.id = this.route.snapshot.params['id'] || 0;
  }

  //#endregion

  //#region Public Properties

  public proposal: ProposalProxy = {
    id: 15,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum enim diam, pellentesque id ligula id, pretium consectetur sapien. Aenean consequat condimentum mauris non vulputate. ',
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  }

  public shootProposalStep: ShootProposalStepEnum = ShootProposalStepEnum.INFO;

  public possibleShootProposalStep: typeof ShootProposalStepEnum = ShootProposalStepEnum;

  //#endregion

  //#region Public Functions

  public changeStep(newStep: ShootProposalStepEnum): void {
    this.shootProposalStep = newStep;
  }

  //#endregion

}
