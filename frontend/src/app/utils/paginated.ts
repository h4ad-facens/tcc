import { BehaviorSubject, finalize, from as fromPromise, mergeMap, Observable, of, tap } from 'rxjs';
import { ProposalProxy } from '../models/proxies/proposal.proxy';

export type PaginatedOrder = 'ASC' | 'DESC';

export type GetPaginatedClosure<TData extends { id: unknown }> = {
  getById: (id: number) => Promise<TData>;
  getCount: () => Promise<number>;
  itemsPerPage: number;
  order?: PaginatedOrder;
  refreshAllWhen?: Observable<unknown>;
  onAddData?: Observable<TData>;
  onUpdateData?: Observable<TData>;
}

export function getPaginatedClosure<TData extends { id: unknown }>(options: GetPaginatedClosure<TData>): [data: Observable<TData[]>, isLoading$: Observable<boolean>, loadMore: () => void, hasMoreData$: Observable<boolean>] {
  const isLoadingSource = new BehaviorSubject<boolean>(false);
  const hasMoreData = new BehaviorSubject<boolean>(false);
  const currentPageSource = new BehaviorSubject<number>(0);
  const currentData = new BehaviorSubject<TData[]>([]);

  const refreshWhenSubscription = options.refreshAllWhen?.subscribe(() => {
    currentData.next([]);
    currentPageSource.next(0);
  });

  const onAddDataSubscription = options.onAddData?.subscribe((data) => {
    const accumulatedData = currentData.getValue();

    if (options.order === 'ASC') {
      accumulatedData.push(data);
    } else {
      accumulatedData.unshift(data);
    }

    currentData.next([...accumulatedData]);
  });

  const onUpdateDataSubscription = options.onUpdateData?.subscribe((data) => {
    const accumulatedData = currentData.getValue();

    const oldDataIndex = accumulatedData.findIndex(old => old.id === data.id);

    if (oldDataIndex === -1)
      return;

    accumulatedData[oldDataIndex] = data;

    currentData.next([...accumulatedData]);
  });

  const getByPageAndAccumulate = async (page: number) => {
    const count = await options.getCount();

    if (count === 0) {
      hasMoreData.next(false);

      return [];
    }

    const from = options.order === 'ASC'
      ? page * options.itemsPerPage + 1
      : Math.max(0, count - page * options.itemsPerPage);

    const to = options.order === 'ASC'
      ? (page + 1) * options.itemsPerPage
      : Math.max(0, count - (page + 1) * options.itemsPerPage);

    hasMoreData.next(from < count);

    if (to === from)
      return [];

    const data: number[] = [];

    for (let id = from; options.order === 'ASC' ? id <= to : id >= to; options.order === 'ASC' ? id++ : id--) {
      if (id <= 0 || id > count)
        continue;

      data.push(id);
    }

    if (data.length === 0)
      return [];

    return await Promise.all(
      data.map(dataId => options.getById(dataId)),
    );
  };

  const onChangePageSubscription = currentPageSource
    .pipe(
      tap(() => isLoadingSource.next(true)),
      mergeMap(page => fromPromise(getByPageAndAccumulate(page))),
      tap(() => isLoadingSource.next(false)),
    ).subscribe(newData => {
      currentData.next(
        [...currentData.getValue(), ...newData],
      );
    });

  return [
    currentData
      .pipe(
        finalize(() => {
          onChangePageSubscription.unsubscribe();

          onAddDataSubscription?.unsubscribe();
          onUpdateDataSubscription?.unsubscribe();
          refreshWhenSubscription?.unsubscribe();
        }),
      ),
    isLoadingSource.asObservable(),
    () => currentPageSource.next(currentPageSource.getValue() + 1),
    hasMoreData.asObservable(),
  ];
}
