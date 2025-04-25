import { useShallowRouter } from '@/common/hooks/useShallowRouter';
import { useRouter, useSearchParams } from 'next/navigation';

export const getDateFilterParams = (
  params: URLSearchParams,
  startTime?: number,
  endTime?: number
) => {
  const startTimeTs = startTime ? Math.floor(startTime).toString() : undefined;
  const endTimeTs = endTime ? Math.floor(endTime).toString() : undefined;
  const mode = startTime && endTime ? 'between' : startTime ? 'after' : 'before';

  if (mode === 'before') {
    if (endTimeTs) {
      params.set('endTime', endTimeTs);
    } else {
      params.delete('endTime');
    }
    params.delete('startTime');
    return params;
  }
  if (mode === 'after') {
    if (startTimeTs) {
      params.set('startTime', startTimeTs);
    } else {
      params.delete('startTime');
    }
    params.delete('endTime');
    return params;
  }
  if (mode === 'between') {
    if (startTimeTs) {
      params.set('startTime', startTimeTs);
    } else {
      params.delete('startTime');
    }
    if (endTimeTs) {
      params.set('endTime', endTimeTs);
    } else {
      params.delete('endTime');
    }
    return params;
  }
  return params;
};

export const useDateFilterHandler = (useShallow: boolean = true) => {
  const searchParams = useSearchParams();
  const shallowRouter = useShallowRouter();
  const router = useRouter();

  return (startTime?: number, endTime?: number) => {
    const params = new URLSearchParams(searchParams);
    const paramsWithDateFilter = getDateFilterParams(params, startTime, endTime);
    if (useShallow) {
      shallowRouter.replace(null, '', `?${paramsWithDateFilter.toString()}`);
    } else {
      router.replace(`?${paramsWithDateFilter.toString()}`);
    }
  };
};

export const getAddressFilterParams = (
  searchParams: URLSearchParams,
  fromAddress: string,
  toAddress: string
) => {
  if (!fromAddress) {
    searchParams.delete('fromAddress');
  } else {
    searchParams.set('fromAddress', fromAddress);
  }
  if (!toAddress) {
    searchParams.delete('toAddress');
  } else {
    searchParams.set('toAddress', toAddress);
  }
  return searchParams;
};

export function useAddressFilterHandler(useShallow: boolean = true) {
  const searchParams = useSearchParams();
  const shallowRouter = useShallowRouter();
  const router = useRouter();

  return (fromAddress: string, toAddress: string) => {
    const params = new URLSearchParams(searchParams);
    const paramsWithAddressFilter = getAddressFilterParams(params, fromAddress, toAddress);
    if (useShallow) {
      shallowRouter.replace(null, '', `?${paramsWithAddressFilter.toString()}`);
    } else {
      router.replace(`?${paramsWithAddressFilter.toString()}`);
    }
  };
}

export const getTransactionTypeFilterParams = (
  searchParams: URLSearchParams,
  transactionType: string[]
) => {
  if (!transactionType || transactionType.length === 0) {
    searchParams.delete('transactionType');
  } else {
    searchParams.set('transactionType', transactionType.join(','));
  }
  return searchParams;
};

export function useTransactionTypeFilterHandler(useShallow: boolean = true) {
  const searchParams = useSearchParams();
  const shallowRouter = useShallowRouter();
  const router = useRouter();

  return (transactionType: string[]) => {
    const params = new URLSearchParams(searchParams);
    const paramsWithTransactionTypeFilter = getTransactionTypeFilterParams(params, transactionType);
    if (useShallow) {
      shallowRouter.replace(null, '', `?${paramsWithTransactionTypeFilter.toString()}`);
    } else {
      router.replace(`?${paramsWithTransactionTypeFilter.toString()}`);
    }
  };
}
