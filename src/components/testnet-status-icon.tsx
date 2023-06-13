import React, { useMemo } from 'react';
import { Icon, Spinner } from '@/ui/components';
import { FlaskIcon, ExclamationCircleIcon } from '@/ui/icons';
import { useColorMode } from '@chakra-ui/react';
import { useTestnetStatus } from '@/app/common/queries/useTestnetStatus';
import { useApi } from '@/common/api/client';
import { ONE_MINUTE } from '@/app/common/queries/query-stale-time';

export const TestnetPendingIcon = (): React.ReactElement => {
  const colorMode = useColorMode().colorMode;
  return <Spinner color={`brand.${colorMode}`} size="16px" mr="4px" />;
};

const TestnetStatusIcon = (): React.ReactElement => {
  const colorMode = useColorMode().colorMode;
  const api = useApi();
  const { isLoading, data: chainTipTs } = useTestnetStatus(api);

  const title = useMemo(() => generateTitle(chainTipTs), [chainTipTs]);

  if (isLoading) return <TestnetPendingIcon />;
  const showWarning = showWarn(chainTipTs);

  return (
    <Icon
      as={showWarning ? ExclamationCircleIcon : FlaskIcon}
      color={showWarning ? 'orange' : `brand.${colorMode}`}
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

    if (diffInMin > 1) return `Last block was processed ${diffInMin} minutes ago.`;
    if (diffInMin < 1) return 'Last block was processed a few seconds ago.';
    return 'Last block was processed a minute ago.';
  } catch (_) {
    return 'Testnet might be experiencing downtime!';
  }
}

export default TestnetStatusIcon;
