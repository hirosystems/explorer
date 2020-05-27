import * as React from 'react';
import { ToastProvider } from '@blockstack/ui';
import { useDispatch } from 'react-redux';
import { TokenTransfer } from '@components/sandbox/token-transfer';
import { ContractDeploy } from '@components/sandbox/contract-deploy';
import { ContractCall } from '@components/sandbox/contract-call';
import { Faucet } from '@components/sandbox/faucet';
import { RawTx } from '@components/sandbox/raw-tx';
import { ReduxNextPageContext } from '@common/types';
import { useDebugState } from '@common/sandbox';
import { parseCookies } from 'nookies';
import { fetchAccount, generateIdentity, setIdentity, setUserData } from '@store/sandbox';
import { usernameStorage, USERNAME_COOKIE } from '@common/utils';
import { PageContent } from '@components/sandbox/page';
import { Connect, FinishedData } from '@blockstack/connect';

const paths = [
  { path: 'faucet', label: 'STX faucet', component: Faucet },
  { path: 'stx-transfer', label: 'STX transfer', component: TokenTransfer },
  { path: 'raw-tx', label: 'Raw transaction', component: RawTx },
  { path: 'contract-deploy', label: 'Contract deploy', component: ContractDeploy },
  { path: 'contract-call', label: 'Contract call', component: ContractCall },
];

const SandboxPage = ({ tab, username }: any) => {
  const [transactionsVisible, setShowTransactions] = React.useState(false);
  const [lastViewedNumber, setLastViewed] = React.useState(0);

  const hideTransactionDialog = () => {
    setShowTransactions(false);
  };
  const showTransactionDialog = () => {
    setShowTransactions(true);
  };

  const dispatch = useDispatch();

  const { lastFetch, loading, identity, error } = useDebugState();

  if (!error && !lastFetch && loading !== 'pending' && identity) {
    dispatch(fetchAccount(identity.address));
  }

  const handleGenerateId = async () => {
    await dispatch(generateIdentity());
  };

  const iconPrefix =
    typeof document !== 'undefined'
      ? document.location.href.toString().replace('/sandbox', '')
      : '';

  const onFinish = async (payload: FinishedData) => {
    const userData = payload.userSession.loadUserData();
    await dispatch(setUserData(userData));
    usernameStorage.set(USERNAME_COOKIE, userData.username);
    await handleGenerateId();
  };

  const authOptions = {
    authOrigin: 'https://deploy-preview-301--stacks-authenticator.netlify.app',
    finished: onFinish,
    appDetails: {
      name: 'Stacks Explorer',
      icon: iconPrefix + '/app-icon.png',
    },
  };

  return (
    <Connect authOptions={authOptions}>
      <ToastProvider>
        <PageContent
          hideTransactionDialog={hideTransactionDialog}
          showTransactionDialog={showTransactionDialog}
          transactionsVisible={transactionsVisible}
          handleGenerateKey={handleGenerateId}
          lastViewedNumber={lastViewedNumber}
          username={username}
          tab={tab}
          tabs={paths}
        />
      </ToastProvider>
    </Connect>
  );
};

SandboxPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const cookies = parseCookies(ctx);
  let tab = ctx?.query?.tab ?? undefined;
  if (cookies) {
    cookies.debug_identity && ctx.store.dispatch(setIdentity(JSON.parse(cookies.debug_identity)));
    return {
      identity: cookies.debug_identity,
      username: cookies[USERNAME_COOKIE] ? JSON.parse(cookies[USERNAME_COOKIE]) : undefined,
      tab,
    };
  }
  return { tab };
};

export default SandboxPage;
