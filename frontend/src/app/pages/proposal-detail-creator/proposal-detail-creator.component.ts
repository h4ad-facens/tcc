//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { randEthereumAddress, randNumber, randParagraph, randPastDate } from '@ngneat/falso';
import { ShootProposalStepEnum } from '../../models/enums/shoot-proposal-step.enum';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';

//#endregion

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail-creator.component.html',
  styleUrls: ['./proposal-detail-creator.component.scss'],
})
export class ProposalDetailCreatorComponent {

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
    description: randParagraph(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
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
