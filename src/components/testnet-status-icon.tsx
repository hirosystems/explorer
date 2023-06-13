import React, { useMemo } from 'react';
import { Icon, Spinner } from '@/ui/components';
import { FlaskIcon, ExclamationCircleIcon } from '@/ui/icons';
import { SYSTEM_STATUS_URL } from '@/common/constants';
import { useColorMode } from '@chakra-ui/react';
import { useTestnetStatus } from '@/app/common/queries/useTestnetStatus';
import { useApi } from '@/common/api/client';
import { ONE_MINUTE } from '@/app/common/queries/query-stale-time';

export const TestnetPendingIcon = (): React.ReactElement => {
  const colorMode = useColorMode().colorMode;
  return <Spinner color={`brand.${colorMode}`} size="16px" mr="4px" />;
};

const TestnetStatusIcon = (): React.ReactElement => {
  const redirectToStatusPage = () => window.open(SYSTEM_STATUS_URL, '_blank');
  const colorMode = useColorMode().colorMode;
  const api = useApi();
  const { isLoading, data: chainTipTs } = useTestnetStatus(api);

  const title = useMemo(() => generateTitle(chainTipTs), [chainTipTs]);

  if (isLoading) return <TestnetPendingIcon />;

  if (showWarn(chainTipTs))
    return (
      <Icon
        as={ExclamationCircleIcon}
        color={'orange'}
        size="16px"
        mr="4px"
        onClick={redirectToStatusPage}
        title={title}
        cursor={'pointer'}
      />
    );

  return (
    <Icon
      as={FlaskIcon}
      color={`brand.${colorMode}`}
      size="16px"
      mr="4px"
      title={title}
      cursor={'pointer'}
    />
  );
};

function showWarn(ts: string | null | undefined): boolean {
  if (!ts) return true;
  try {
    const diffInMs = Date.now() - new Date(ts).getTime();
    if (diffInMs > ONE_MINUTE * 60) return true;
    return false;
  } catch (_) {
    return true;
  }
}

function generateTitle(ts: string | null | undefined) {
  if (!ts) return 'Testnet might be experiencing downtime!';
  try {
    const diffInMs = Date.now() - new Date(ts).getTime();
    const diffInMin = Math.floor(diffInMs / 1000 / 60);

    if (diffInMin > 1) return `Last txn processed ${diffInMin} minutes ago.`;
    if (diffInMin < 1) return 'Last txn processed a few seconds ago.';
    return 'Last txn processed a minute ago.';
  } catch (_) {
    return 'Testnet might be experiencing downtime!';
  }
}

export default TestnetStatusIcon;
