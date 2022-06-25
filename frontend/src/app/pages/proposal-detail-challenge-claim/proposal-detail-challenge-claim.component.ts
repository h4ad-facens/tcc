//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { randEthereumAddress, randNumber, randParagraph, randPastDate } from '@ngneat/falso';
import { ResultsInterface } from '../../models/interfaces/results.interface';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';

//#endregion

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail-challenge-claim.component.html',
  styleUrls: ['./proposal-detail-challenge-claim.component.scss'],
})
export class ProposalDetailChallengeClaimComponent {

  //#region Constructor

  constructor(
    private readonly route: ActivatedRoute,
  ) {
    this.proposal.id = this.route.snapshot.params['id'] || 0;
  }

  //#endregion

  //#region Public Properties

  public results: ResultsInterface = {
    freelance: NaN,
    creator: NaN,
    total: 200,
  }

  public proposal: ProposalProxy = {
    id: 15,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: randParagraph(),
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
  }

  public total: number = randNumber({ min: 0, max: 200, precision: 1 });

  //#endregion

}
