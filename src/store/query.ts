import { atom, Getter } from 'jotai';
import { atomWithQuery as _atomWithQuery, queryClientAtom } from 'jotai/query';
import { atomFamily } from 'jotai/utils';
import { QueryObserverOptions } from 'react-query';
import deepEqual from 'fast-deep-equal';
import memoize from 'micro-memoize';
import { DEFAULT_POLLING_INTERVAL } from '@common/constants';

const IS_SSR = typeof document === 'undefined';

export const initialDataAtom = atomFamily(queryKey => atom(null), deepEqual);
const makeQueryKey = memoize((key: string, param?: unknown): [string, unknown | undefined] => [
  key,
  param,
]);

export const atomFamilyWithQuery = <Param, Data>(
  key: string,
  queryFn: (get: Getter, param: Param) => Data | Promise<Data>,
  options: {
    equalityFn?: (a: Data, b: Data) => boolean;
  } & QueryObserverOptions = {}
) => {
  const { equalityFn = deepEqual, ...rest } = options;
  return atomFamily<Param, Data>(param => {
    const queryKey = makeQueryKey(key, param);
    const queryAtom = _atomWithQuery(get => {
      const initialData = get(initialDataAtom(param));
      return {
        queryKey,
        queryFn: () => queryFn(get, param),
        initialData,
        keepPreviousData: true,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchInterval: DEFAULT_POLLING_INTERVAL,
        ...rest,
      } as any;
    }, equalityFn);
    const anAtom = atom(
      get => {
        const initialData = get(initialDataAtom(param));
        if (IS_SSR) {
          return initialData as unknown as Data;
        } else {
          const queryData = get(queryAtom);
          return (queryData || initialData) as Data;
        }
      },
      async get => {
        const queryClient = get(queryClientAtom);
        await queryClient?.refetchQueries({
          queryKey,
        });
      }
    );

    return anAtom;
  }, deepEqual);
};

export const atomWithQuery = <Data>(
  key: string,
  queryFn: (get: Getter) => Data | Promise<Data>,
  options: {
    equalityFn?: (a: Data, b: Data) => boolean;
  } & QueryObserverOptions = {}
) => {
  const { equalityFn = deepEqual, ...rest } = options;
  const queryKey = makeQueryKey(key);
  const queryAtom = _atomWithQuery(get => {
    const initialData = get(initialDataAtom(key));
    return {
      queryKey,
      queryFn: () => queryFn(get),
      initialData,
      keepPreviousData: true,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: DEFAULT_POLLING_INTERVAL,
      ...rest,
    };
  });

  return atom<Data, void>(
    get => {
      const initialData = get(initialDataAtom(key));
      if (IS_SSR) {
        return initialData as unknown as Data;
      } else {
        const queryData = get(queryAtom);
        return (queryData || initialData) as Data;
      }
    },
    async get => {
      const queryClient = get(queryClientAtom);
      await queryClient?.refetchQueries({
        queryKey,
      });
    }
  );
};
