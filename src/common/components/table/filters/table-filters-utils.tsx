import { useShallowRouter } from '@/common/hooks/useShallowRouter';
import { useRouter, useSearchParams } from 'next/navigation';

import { TransactionEventType } from '@stacks/stacks-blockchain-api-types';

type ParamMutator<Args extends any[]> = (params: URLSearchParams, ...args: Args) => URLSearchParams;

export enum FilterQueryKey {
  StartTime = 'startTime',
  EndTime = 'endTime',
  FromAddress = 'fromAddress',
  ToAddress = 'toAddress',
  TransactionType = 'transactionType',
  EventAssetType = 'eventAssetTypes',
  Address = 'address',
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

//TODO: we can probably abstract this out to a generic filter mutator
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

export function singleAddressFilterMutator(params: URLSearchParams, address?: string) {
  if (address) params.set(FilterQueryKey.Address, address);
  else params.delete(FilterQueryKey.Address);
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

export function eventAssetTypeFilterMutator(
  params: URLSearchParams,
  eventAssetType?: TransactionEventType[]
) {
  if (eventAssetType) {
    console.log('eventAssetTypeFilterMutator', { eventAssetType });
    params.set(FilterQueryKey.EventAssetType, eventAssetType.join(','));
  } else {
    params.delete(FilterQueryKey.EventAssetType);
  }
  return params;
}
