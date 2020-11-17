import * as React from 'react';
import { useConnect } from '@common/hooks/use-connect';
import { SignedOutView } from '@components/sandbox/views/signed-out-view';
import { SignedInView } from '@components/sandbox/views/signed-in-view';
import { useAuth } from '@common/hooks/use-auth';

const PageContent = React.memo(() => {
  useAuth();
  const { userData } = useConnect();
  const isSignedIn = userData?.appPrivateKey;
  return isSignedIn ? <SignedInView /> : <SignedOutView />;
});

export default PageContent;
