import * as React from 'react';
import { ToastProvider } from '@blockstack/ui';
import { useDispatch } from 'react-redux';
import { TokenTransfer } from '@components/sandbox/token-transfer';
import { ContractDeploy } from '@components/sandbox/contract-deploy';
import { ContractCall } from '@components/sandbox/contract-call';
import { Faucet } from '@components/sandbox/faucet';
import { RawTx } from '@components/sandbox/raw-tx';
import { ReduxNextPageContext } from '@common/types';
import { AppConfig, UserSession } from 'blockstack/lib';
import { doGenerateIdentity, useDebugState } from '@common/sandbox';
import { parseCookies } from 'nookies';
import { fetchAccount, setIdentity, setUserData } from '@store/sandbox';
import { usernameStorage, USERNAME_COOKIE, identityStorage } from '@common/utils';
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
  const [iconPath, setIconPath] = React.useState<string | undefined>(undefined);
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession = new UserSession({ appConfig });
  const [transactionsVisible, setShowTransactions] = React.useState(false);

  const hideTransactionDialog = () => {
    setShowTransactions(false);
  };
  const showTransactionDialog = () => {
    setShowTransactions(true);
  };

  const dispatch = useDispatch();

  const { lastFetch, loading, identity, error } = useDebugState();

  React.useEffect(() => {
    if (!error && !lastFetch && loading !== 'pending' && identity) {
      dispatch(fetchAccount(identity.address));
    }
  }, [error, lastFetch, loading, identity]);

  React.useEffect(() => {
    const iconPrefix = typeof document !== 'undefined' ? document.location.origin.toString() : '';
    if (!iconPath) {
      setIconPath(iconPrefix);
    }
  }, []);

  const onFinish = React.useCallback(async (payload: FinishedData) => {
    const userData = payload.userSession.loadUserData();
    await dispatch(setUserData(userData));
    usernameStorage.set(USERNAME_COOKIE, userData.username);
    try {
      const saved = await payload.userSession.getFile('identity.json');
      const _identity = JSON.parse(saved as string);
      identityStorage.set('debug_identity', _identity);
      await dispatch(setIdentity(_identity));
      return;
    } catch (e) {
      const _identity = await doGenerateIdentity();
      await payload.userSession.putFile('identity.json', JSON.stringify(_identity));
      identityStorage.set('debug_identity', _identity);
      await dispatch(setIdentity(_identity));
      return;
    }
  }, []);

  const authOptions = {
    authOrigin: 'https://deploy-preview-301--stacks-authenticator.netlify.app',
    finished: onFinish,
    userSession,
    appDetails: {
      name: 'Stacks Explorer',
      icon: iconPath + '/app-icon.png',
    },
  };

  return (
    <Connect authOptions={authOptions}>
      <ToastProvider>
        <PageContent
          hideTransactionDialog={hideTransactionDialog}
          showTransactionDialog={showTransactionDialog}
          transactionsVisible={transactionsVisible}
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
