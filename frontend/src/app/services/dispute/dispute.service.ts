import { Injectable } from '@angular/core';
import { Web3Service } from '../../modules/web3/services/web3.service';

@Injectable({
  providedIn: 'root',
})
export class DisputeService {

  //#region Constructor

  constructor(
    protected readonly web3: Web3Service,
  ) {

  }

  //#endregion

  //#region Public Methods

  public async enterInDispute(proposalId: number): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar entrar em disputa em uma proposta.');

      const transaction = await this.web3.disputeContract
        .connect(currentSigner)
        .createDispute(
          proposalId,
        );

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, `Ocorreu um erro ao tentar entrar em disputa com essa proposta: ${ e.message }`];
    }
  }

  //#endregion

}
