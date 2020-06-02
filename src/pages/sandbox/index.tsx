import * as React from 'react';
import { ToastProvider } from '@blockstack/ui';
import { useDispatch } from 'react-redux';
import { TokenTransfer } from '@components/sandbox/token-transfer';
import { ContractDeploy } from '@components/sandbox/contract-deploy';
import { ContractCall } from '@components/sandbox/contract-call';
import { Faucet } from '@components/sandbox/faucet';
import { RawTx } from '@components/sandbox/raw-tx';
import { ReduxNextPageContext } from '@common/types';
import { useSandboxState, defaultOpts } from '@common/sandbox';
import { parseCookies } from 'nookies';
import {
  fetchAccount,
  generateIdentity,
  setIdentity,
  setUserData,
  signUserOut,
} from '@store/sandbox';
import { usernameStorage, identityStorage, USERNAME_COOKIE } from '@common/utils';
import { PageContent } from '@components/sandbox/page';
import { Connect, FinishedData } from '@blockstack/connect';
import { useUserSession } from '@common/hooks/use-user-session';

const paths = [
  { path: 'faucet', label: 'STX faucet', component: Faucet },
  { path: 'stx-transfer', label: 'STX transfer', component: TokenTransfer },
  { path: 'raw-tx', label: 'Raw transaction', component: RawTx },
  { path: 'contract-deploy', label: 'Contract deploy', component: ContractDeploy },
  { path: 'contract-call', label: 'Contract call', component: ContractCall },
];

const SandboxPage = ({ tab, username, stxAddress }: any) => {
  const [transactionsVisible, setShowTransactions] = React.useState(false);
  const { user } = useSandboxState();
  const { userData, userSession } = useUserSession();

  const hideTransactionDialog = () => {
    setShowTransactions(false);
  };
  const showTransactionDialog = () => {
    setShowTransactions(true);
  };

  const dispatch = useDispatch();

  const handleGenerateId = async () => {
    await dispatch(generateIdentity());
  };

  const onFinish = async (payload: FinishedData) => {
    const userData = payload.userSession.loadUserData();
    await dispatch(setUserData(userData));
    await dispatch(fetchAccount(userData.profile.stxAddress));
    usernameStorage.set(USERNAME_COOKIE, userData.username);
    identityStorage.set('STX_ADDRESS', userData.profile.stxAddress);
  };

  const handleSignOut = () => {
    userSession.signUserOut();
    usernameStorage.remove(USERNAME_COOKIE);
    identityStorage.remove('STX_ADDRESS');
    dispatch(signUserOut());
  };

  const authOptions = {
    ...defaultOpts,
    finished: onFinish,
  };

  React.useEffect(() => {
    if (username && stxAddress && !user && userData) {
      dispatch(setUserData(userData));
      dispatch(fetchAccount(stxAddress));
    }
  }, [username, stxAddress, user, userData]);

  return (
    <Connect authOptions={authOptions}>
      <ToastProvider>
        <PageContent
          hideTransactionDialog={hideTransactionDialog}
          showTransactionDialog={showTransactionDialog}
          transactionsVisible={transactionsVisible}
          handleGenerateKey={handleGenerateId}
          username={username}
          stxAddress={stxAddress}
          tab={tab}
          tabs={paths}
          handleSignOut={handleSignOut}
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
      stxAddress: cookies.STX_ADDRESS ? JSON.parse(cookies.STX_ADDRESS) : undefined,
      username: cookies[USERNAME_COOKIE] ? JSON.parse(cookies[USERNAME_COOKIE]) : undefined,
      tab,
    };
  }
  return { tab };
};

export default SandboxPage;
