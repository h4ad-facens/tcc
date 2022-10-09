//#region Imports

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';

//#endregion

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardComponent {

  //#region Public Properties

  @Input()
  public proposal!: ProposalProxy;

  public imageBaseUrl: string = environment.imageBaseUrl;

  //#endregion

}
