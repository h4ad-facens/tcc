//#region Imports

import { Component, Input } from '@angular/core';
import { DisputeStatusEnum } from '../../models/enums/dispute-status.enum';

//#endregion

export type DisputeStatusSettings = { text: string, color?: string }

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss'],
})
export class HomeCardComponent {

  //#region Public Properties

  @Input()
  public disputeStatus: DisputeStatusEnum | undefined = DisputeStatusEnum.NONE;

  public possibleDisputeStatus: typeof DisputeStatusEnum = DisputeStatusEnum;

  public formatDisputeStatus: Record<DisputeStatusEnum, DisputeStatusSettings> = {
    [DisputeStatusEnum.NONE]: { text: '' },
    [DisputeStatusEnum.CHOOSING]: { text: 'Escolher mediador', color: '#FFFFFF' },
    [DisputeStatusEnum.AWAITING]: { text: 'Aguardando mediador', color: '#FFD130' },
    [DisputeStatusEnum.FINISHED]: { text: 'Reinvidicar ganhos', color: '#00FF29' },
  };

  //#endregion

}
