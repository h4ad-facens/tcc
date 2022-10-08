//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { randEthereumAddress, randNumber, randParagraph, randPastDate } from '@ngneat/falso';
import { ShootProposalStepEnum } from '../../models/enums/shoot-proposal-step.enum';
import { ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';

//#endregion

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail-challenge.component.html',
  styleUrls: ['./proposal-detail-challenge.component.scss'],
})
export class ProposalDetailChallengeComponent {

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

  public state: 'waiting' | 'choose' = 'choose';

  public today = new Date();

  public shoots = [
    { shootValue: randNumber({ min: 200, max: 400, precision: 2 }), address: randEthereumAddress(), date: randPastDate() },
    { shootValue: randNumber({ min: 200, max: 400, precision: 2 }), address: randEthereumAddress(), date: randPastDate() },
    { shootValue: randNumber({ min: 200, max: 400, precision: 2 }), address: randEthereumAddress(), date: randPastDate() },
    { shootValue: randNumber({ min: 200, max: 400, precision: 2 }), address: randEthereumAddress(), date: randPastDate() },
  ].sort((a, b) => a.shootValue > b.shootValue ? -1 : 1);

  //#endregion

}
