import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-query-toolkit';
import { apiClientsState } from '@store/api-clients';

export enum InfoQueryKeys {
  INFO = 'stacks/INFO',
}

export const stacksInfoState = atomWithQuery(
  InfoQueryKeys.INFO,
  get => {
    const { infoApi } = get(apiClientsState);
    return infoApi.getCoreApiInfo();
  },
  { refetchInterval: false, getShouldRefetch: () => false }
);

export const currentStacksHeight = atom(get => get(stacksInfoState).stacks_tip_height);
