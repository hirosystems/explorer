import * as React from 'react';
import { useConnect } from '@sandbox/hooks/use-connect';
import { useAuth } from '@sandbox/hooks/use-auth';
import { SignedOutView } from '@sandbox/components/views/signed-out-view';
import { SignedInView } from '@sandbox/components/views/signed-in-view';

const PageContent = React.memo(() => {
  useAuth();
  const { userData } = useConnect();
  const isSignedIn = userData?.appPrivateKey;
  return isSignedIn ? <SignedInView /> : <SignedOutView />;
});

export default PageContent;
