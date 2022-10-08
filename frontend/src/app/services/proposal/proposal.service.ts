//#region Imports

import { Injectable } from '@angular/core';
import { BehaviorSubject, from as fromPromise, mergeMap, Observable, tap } from 'rxjs';
import { ProposalPayload } from '../../models/payloads/proposal.payload';
import { ProposalProxy } from '../../models/proxies/proposal.proxy';
import { Web3Service } from '../../modules/web3/services/web3.service';
import { BoringPipe } from '../../pipes/boring.pipe';
import { parseEtherToBigNumber } from '../../utils/ether';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class ProposalService {

  constructor(
    private readonly web3Service: Web3Service,
  ) {
  }

  public async createProposal(payload: ProposalPayload): Promise<[boolean, string?]> {
    try {
      const currentSigner = this.web3Service.signer$.getValue();

      if (!currentSigner)
        throw new Error('Você precisa primeiro se conectar com a sua carteira antes de tentar criar uma proposta.');

      const transaction = await this.web3Service.proposalContract
        .connect(currentSigner)
        .createProposal(
          payload.name,
          payload.description,
          payload.category,
          payload.contactInfo,
          { value: parseEtherToBigNumber(payload.amount) },
        );

      const receipt = await transaction.wait();

      console.log(receipt);
      console.log(transaction);

      return [true];
    } catch (e: any) {
      return [false, `Ocorreu um erro ao criar a proposta: ${ e.message }`];
    }
  }

  public async getCountOfProposals(): Promise<number> {
    return this.web3Service.proposalContract.getCountOfProposals().then(count => count.toNumber());
  }

  public getPaginatedProposals(itemsPerPage: number, order: 'ASC' | 'DESC'): [data: Observable<ProposalProxy[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
    const isLoadingSource = new BehaviorSubject<boolean>(false);
    const hasMoreData = new BehaviorSubject<boolean>(false);
    const currentPageSource = new BehaviorSubject<number>(0);
    const accumulatedData: ProposalProxy[] = [];

    const getByPageAndAccumulate = async (page: number) => {
      const count = await this.web3Service.proposalContract.getCountOfProposals().then(n => n.toNumber());

      if (count === 0) {
        hasMoreData.next(false);

        return accumulatedData;
      }

      const to = order === 'ASC'
        ? (page + 1) * itemsPerPage - 1
        : count - (page + 1) * itemsPerPage;

      const from = order === 'ASC'
        ? page * itemsPerPage
        : count - (page) * itemsPerPage - 1;

      hasMoreData.next(from < count);

      if (to === from)
        return accumulatedData;

      const proposalIds: number[] = [];

      for (let proposalId = from; order === 'ASC' ? proposalId <= to : proposalId >= to; order === 'ASC' ? proposalId++ : proposalId--) {
        if (proposalId < 0 || proposalId >= count)
          continue;

        proposalIds.push(proposalId);
      }

      if (proposalIds.length === 0)
        return accumulatedData;

      const newData = await Promise.all(
        proposalIds.map(proposalId => this.getProposalById(proposalId)),
      );

      accumulatedData.push(...newData);

      return accumulatedData;
    };

    return [
      currentPageSource
        .pipe(
          tap(() => isLoadingSource.next(true)),
          mergeMap(page => fromPromise(getByPageAndAccumulate(page))),
          tap(() => isLoadingSource.next(false)),
        ),
      isLoadingSource.asObservable(),
      () => currentPageSource.next(currentPageSource.getValue() + 1),
      hasMoreData.asObservable(),
    ];
  }

  public async getProposalById(id: number): Promise<ProposalProxy> {
    return this.web3Service.proposalContract.getProposalById(id)
      .then(proposal => ({
        id,
        description: proposal.description,
        name: proposal.name,
        amount: proposal.amount,
        category: proposal.category,
        contactInfo: proposal.contactInfo,
        status: proposal.status,
        creator: proposal.creator,
        imageUrl: BoringPipe.getSvg(`proposals_${ id }`, 'bauhaus'),
      }));
  }
}
