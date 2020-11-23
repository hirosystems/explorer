import { atomFamily, atom, selectorFamily } from 'recoil';
import { UserData, AppConfig, UserSession } from '@stacks/auth';
import { AuthOptions } from '@stacks/connect';
import { generateRandomName } from '@common/hooks/use-random-name';
import { helloWorldContract } from '@common/sandbox/contracts';
import { fetchContractInterface } from '@common/sandbox';
import { TransactionType } from '@models/transaction.interface';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const authOptionsAtom = atom<Partial<AuthOptions>>({
  key: 'authOptions',
  default: {
    userSession: userSession as any,
    appDetails: {
      name: 'Stacks Explorer',
      icon: `/app-icon.png`,
    },
  },
});

const userDataEffect = ({ setSelf }: any) => {
  const isSignedIn = userSession.isUserSignedIn();
  if (isSignedIn) {
    setSelf(userSession.loadUserData());
  }
};

export const userDataAtom = atom<UserData | undefined>({
  key: 'sandbox.userData',
  default: undefined,
  effects_UNSTABLE: [userDataEffect],
});

export const codeBodyState = atom({
  key: 'sandbox.contract-editor-value',
  default: helloWorldContract.source,
});

export const contractNameState = atom({
  key: 'sandbox.contract-name-value',
  default: generateRandomName(),
});

export const tabState = atom<'deploy' | 'call' | 'transfer' | 'faucet'>({
  key: 'sandbox.view',
  default: 'deploy',
});

export const txPanelState = atom<'visible' | 'hidden'>({
  key: 'sandbox.tx-panel',
  default: 'visible',
});

export const txDetailsState = atomFamily<'hidden' | 'visible', string>({
  key: 'sandbox.txDetails',
  default: 'hidden',
});

export const txContractStateError = atom({
  key: 'sandbox.txDetails.error',
  default: undefined,
});

export const txContractState = selectorFamily<any, { apiServer: string; contractId: string }>({
  key: 'sandbox.txDetails',
  get: ({ apiServer, contractId }) => async () => {
    const data = await fetchContractInterface(apiServer)(
      contractId.split('.')[0],
      contractId.split('.')[1]
    );
    if (data.error) {
      throw data.error;
    }
    return {
      ...data,
      abi: JSON.parse(data.abi),
    };
  },
});

export const functionNameState = atom({
  key: 'sandbox.contract-call.function-name',
  default: undefined,
});

export const toolsState = atom<'hidden' | 'visible'>({
  key: 'sandbox.tools',
  default: 'hidden',
});

export const contractSearchQueryState = atom({
  key: 'sandbox.contract-call.search',
  default: '',
});

export const currentFunctionState = atom<string | undefined>({
  key: 'sandbox.contract-call.current-function',
  default: undefined,
});
export const contractCallViewState = atom<'search' | 'fn'>({
  key: 'sandbox.contract-call.view',
  default: 'search',
});

export const clarityWasmAtom = atom({
  key: 'sandbox.clarityWasm',
  default: undefined,
});

export const replResultState = atom({
  key: 'sandbox.repl',
  default: undefined,
});
export type TxTypeFilterOptions = [
  typeof TransactionType.SMART_CONTRACT,
  typeof TransactionType.CONTRACT_CALL,
  typeof TransactionType.TOKEN_TRANSFER
];
export const filterState = atomFamily({
  key: 'sandbox.tx-panel.filter',
  default: {
    showing: false,
    types: [
      TransactionType.SMART_CONTRACT,
      TransactionType.CONTRACT_CALL,
      TransactionType.TOKEN_TRANSFER,
    ],
    showPending: true,
    showFailed: true,
  },
});
