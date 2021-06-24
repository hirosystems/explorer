import { atom } from 'jotai';
import { transactionSingleState } from '@store/transactions';
import { blocksSingleState } from '@store/blocks';
import { contractInfoState, contractInterfaceState, contractSourceState } from '@store/contracts';
import { selectAtom } from 'jotai/utils';

export type InViewTypes = 'home' | 'tx' | 'address' | 'transactions' | 'blocks' | 'block';

export interface InView {
  type: InViewTypes;
  payload: string;
}

export const currentlyInViewState = atom<InView | null>(null);

export const transactionInViewState = atom(get => {
  const inView = get(currentlyInViewState);
  if (!inView || inView.type !== 'tx') return;
  return get(transactionSingleState(inView.payload));
});

export const transactionTypeInViewState = selectAtom(
  transactionInViewState,
  state => state?.tx_type
);

export const blockHashInView = atom(get => {
  const inView = get(currentlyInViewState);
  if (!inView) return;
  if (inView.type === 'block') return inView.payload;
  if (inView.type === 'tx') {
    const tx = get(transactionInViewState);
    if (tx?.tx_status === 'success') return tx.block_hash;
  }
});

export const blockInViewState = atom(get => {
  const hash = get(blockHashInView);
  if (hash) return get(blocksSingleState(hash));
});

const contractPrincipalInViewState = atom(get => {
  const inView = get(currentlyInViewState);
  if (!inView || inView.type !== 'tx') return;
  if (inView.type === 'tx') {
    const tx = get(transactionInViewState);
    if (tx?.tx_type === 'contract_call') return tx.contract_call.contract_id;
    if (tx?.tx_type === 'smart_contract') return tx.smart_contract.contract_id;
  }
});

export const contractSourceInViewState = atom(get => {
  const contractPrincipal = get(contractPrincipalInViewState);
  if (contractPrincipal) return get(contractSourceState(contractPrincipal));
});

export const contractInterfaceInViewState = atom(get => {
  const contractPrincipal = get(contractPrincipalInViewState);
  if (contractPrincipal) return get(contractInterfaceState(contractPrincipal));
});

export const contractInfoInViewState = atom(get => {
  const contractPrincipal = get(contractPrincipalInViewState);
  if (contractPrincipal) {
    const data = get(contractInfoState(contractPrincipal));
    return { ...data, abi: JSON.parse(data.abi) };
  }
});
