import { atom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';
import { networkCurrentUrlSelector } from '@store/recoil/network';
import { ChainID } from '@stacks/transactions';

export const networkUrlState = atomWithDefault<string | null>(get =>
  get(networkCurrentUrlSelector)
);

export const networkIdState = atom<ChainID>(ChainID.Mainnet);
