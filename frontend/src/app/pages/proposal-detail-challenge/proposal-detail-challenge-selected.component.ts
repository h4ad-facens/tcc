//#region Imports

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProposalDetailChallengeComponent } from './proposal-detail-challenge.component';

//#endregion

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail-challenge.component.html',
  styleUrls: ['./proposal-detail-challenge.component.scss'],
})
export class ProposalDetailChallengeSelectedComponent extends ProposalDetailChallengeComponent {

  //#region Constructor

  constructor(
    route: ActivatedRoute,
  ) {
    super(route);

    this.state = 'waiting'
  }

  //#endregion

}
