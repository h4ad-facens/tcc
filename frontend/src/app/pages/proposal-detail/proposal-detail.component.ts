//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { randEthereumAddress, randNumber, randParagraph, randPastDate } from '@ngneat/falso';
import { ShootProposalStepEnum } from '../../models/enums/shoot-proposal-step.enum';
import { ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';

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
    name: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randParagraph(),
    category: '',
    contactInfo: '',
    amount: 400,
    imageUrl: '',
    status: ProposalStatus.IN_DEVELOPMENT,
    creator: randEthereumAddress(),
  }

  public shootProposalStep: ShootProposalStepEnum = ShootProposalStepEnum.INFO;

  public possibleShootProposalStep: typeof ShootProposalStepEnum = ShootProposalStepEnum;

  public shootValue: number = 0;

  public today = new Date();

  public shoots = [
    { shootValue: randNumber({ min: 200, max: 400, precision: 2 }), address: randEthereumAddress(), date: randPastDate() },
    { shootValue: randNumber({ min: 200, max: 400, precision: 2 }), address: randEthereumAddress(), date: randPastDate() },
    { shootValue: randNumber({ min: 200, max: 400, precision: 2 }), address: randEthereumAddress(), date: randPastDate() },
    { shootValue: randNumber({ min: 200, max: 400, precision: 2 }), address: randEthereumAddress(), date: randPastDate() },
  ].sort((a, b) => a.shootValue > b.shootValue ? -1 : 1);

  //#endregion

  //#region Public Functions

  public changeStep(newStep: ShootProposalStepEnum): void {
    this.shootProposalStep = newStep;
  }

  //#endregion

}
