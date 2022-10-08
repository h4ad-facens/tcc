//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { randEthereumAddress, randNumber, randPastDate } from '@ngneat/falso';
import { ResultsInterface } from '../../models/interfaces/results.interface';
import { createMockProposal, ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';

//#endregion

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail-challenge-distribute.component.html',
  styleUrls: ['./proposal-detail-challenge-distribute.component.scss'],
})
export class ProposalDetailChallengeDistributeComponent {

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

  public proposal: ProposalProxy = createMockProposal(15, ProposalStatus.IN_DISPUTE_DISTRIBUTION)

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
