import { useShallowRouter } from '@/common/hooks/useShallowRouter';
import { useRouter, useSearchParams } from 'next/navigation';

type ParamMutator<Args extends any[]> = (params: URLSearchParams, ...args: Args) => URLSearchParams;

export enum FilterQueryKey {
  StartTime = 'startTime',
  EndTime = 'endTime',
  FromAddress = 'fromAddress',
  ToAddress = 'toAddress',
  TransactionType = 'transactionType',
}

export function useQueryUpdater<Args extends any[]>(
  mutateParams: ParamMutator<Args>,
  useShallow: boolean = true
) {
  const searchParams = useSearchParams();
  const shallowRouter = useShallowRouter();
  const router = useRouter();

  return (...args: Args) => {
    const params = new URLSearchParams(searchParams);
    const newParams = mutateParams(params, ...args);
    if (useShallow) {
      shallowRouter.replace(null, '', `?${newParams.toString()}`);
    } else {
      router.replace(`?${newParams.toString()}`);
    }
  };
}

export function dateFilterMutator(params: URLSearchParams, startTime?: number, endTime?: number) {
  if (startTime) params.set(FilterQueryKey.StartTime, startTime.toString());
  else params.delete(FilterQueryKey.StartTime);
  if (endTime) params.set(FilterQueryKey.EndTime, endTime.toString());
  else params.delete(FilterQueryKey.EndTime);
  return params;
}

export function addressFilterMutator(
  params: URLSearchParams,
  fromAddress?: string,
  toAddress?: string
) {
  if (fromAddress) params.set(FilterQueryKey.FromAddress, fromAddress);
  else params.delete(FilterQueryKey.FromAddress);
  if (toAddress) params.set(FilterQueryKey.ToAddress, toAddress);
  else params.delete(FilterQueryKey.ToAddress);
  return params;
}

export function transactionTypeFilterMutator(params: URLSearchParams, transactionType?: string[]) {
  if (transactionType) {
    params.set(FilterQueryKey.TransactionType, transactionType.join(','));
  } else {
    params.delete(FilterQueryKey.TransactionType);
  }
  return params;
}
