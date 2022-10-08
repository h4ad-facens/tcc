//#region Imports

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProposalProxy, ProposalStatus } from '../../models/proxies/proposal.proxy';

//#endregion

export type ProposalStatusSettings = { text: string, color?: string }

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

  public get proposalStatus(): ProposalStatusSettings {
    return this.formatProposalStatus[this.proposal.status as keyof typeof ProposalStatus] || { text: 'Desconhecido', color: '#FFF' };
  }

  public formatProposalStatus: Record<keyof typeof ProposalStatus, ProposalStatusSettings> = {
    IN_DISPUTE: { text: 'Escolher mediador', color: '#FFFFFF' },
    CANCELLED: { text: 'Cancelada', color: '#490700' },
    FINISHED: { text: 'Finalizada', color: '#00a123' },
    IN_DISPUTE_DISTRIBUTION: { text: 'Distribuir valores', color: '#d20f0f' },
    IN_DEVELOPMENT: { text: 'Em desenvolvimento', color: '#009fe5' },
    WAITING_BID: { text: 'Aguardando lances', color: '#b7b402' },
  };

  public imageBaseUrl: string = environment.imageBaseUrl;

  //#endregion

}
