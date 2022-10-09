import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ProposalStatus } from '../models/proxies/proposal.proxy';

export type ProposalStatusSettings = { text: string, color: string, bgColor: string }

@Pipe({
  name: 'proposalStatus',
})
export class ProposalStatusPipe implements PipeTransform {
  public formatProposalStatus: Record<string, ProposalStatusSettings> = {
    [ProposalStatus.IN_DISPUTE]: { text: 'Escolher mediador', color: '#FFFFFF', bgColor: '#7c00ad' },
    [ProposalStatus.CANCELLED]: { text: 'Cancelada', color: '#FFF', bgColor: '#ff1900' },
    [ProposalStatus.FINISHED]: { text: 'Finalizada', color: '#FFF', bgColor: '#00a123' },
    [ProposalStatus.IN_DISPUTE_DISTRIBUTION]: { text: 'Distribuir valores', color: '#FFF', bgColor: '#ff6900' },
    [ProposalStatus.IN_DEVELOPMENT]: { text: 'Em desenvolvimento', color: '#FFF', bgColor: '#009fe5' },
    [ProposalStatus.WAITING_BID]: { text: 'Aguardando lances', color: '#FFF', bgColor: '#b7b402' },
  };


  transform(status: string): ProposalStatusSettings {
    return this.formatProposalStatus[status] || { text: 'Desconhecido', color: '#FFF' };
  }
}

@NgModule({
  exports: [
    ProposalStatusPipe,
  ],
  declarations: [
    ProposalStatusPipe,
  ],
})
export class ProposalStatusPipeModule {}
