import { BehaviorSubject, finalize, from as fromPromise, mergeMap, Observable, of, tap } from 'rxjs';
import { ProposalProxy } from '../models/proxies/proposal.proxy';

export function getPaginatedClosure<TData>(
  getById: (id: number) => Promise<TData>,
  getCount: () => Promise<number>,
  itemsPerPage: number,
  order: 'ASC' | 'DESC',
  refreshWhen: Observable<unknown> = of(0),
): [data: Observable<TData[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
  const isLoadingSource = new BehaviorSubject<boolean>(false);
  const hasMoreData = new BehaviorSubject<boolean>(false);
  const currentPageSource = new BehaviorSubject<number>(0);

  let accumulatedData: TData[] = [];

  const refreshWhenSubscription = refreshWhen.subscribe(() => {
    accumulatedData = [];
    currentPageSource.next(0);
  });

  const getByPageAndAccumulate = async (page: number) => {
    const count = await getCount();

    if (count === 0) {
      hasMoreData.next(false);

      return accumulatedData;
    }

    const to = order === 'ASC'
      ? (page + 1) * itemsPerPage
      : count - (page + 1) * itemsPerPage;

    const from = order === 'ASC'
      ? page * itemsPerPage + 1
      : count - (page) * itemsPerPage - 1;

    hasMoreData.next(from < count);

    if (to === from)
      return accumulatedData;

    const data: number[] = [];

    for (let proposalId = from; order === 'ASC' ? proposalId <= to : proposalId >= to; order === 'ASC' ? proposalId++ : proposalId--) {
      if (proposalId <= 0 || proposalId > count)
        continue;

      data.push(proposalId);
    }

    if (data.length === 0)
      return accumulatedData;

    const newData = await Promise.all(
      data.map(dataId => getById(dataId)),
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
        finalize(() => refreshWhenSubscription.unsubscribe()),
      ),
    isLoadingSource.asObservable(),
    () => currentPageSource.next(currentPageSource.getValue() + 1),
    hasMoreData.asObservable(),
  ];
}
