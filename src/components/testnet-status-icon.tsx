import React, { useMemo } from 'react';
import { Icon, Spinner } from '@/ui/components';
import { FlaskIcon, ExclamationCircleIcon } from '@/ui/icons';
import { useColorMode } from '@chakra-ui/react';
import { useTestnetStatus } from '@/app/common/queries/useTestnetStatus';
import { useApi } from '@/common/api/client';
import dayjs from 'dayjs';

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
    const now = dayjs();
    const blockTs = dayjs(ts);
    return now.diff(blockTs, 'hour') > 1;
  } catch (_) {
    return true;
  }
}

function generateTitle(ts: string | null | undefined) {
  if (!ts) return 'Testnet might be experiencing downtime!';
  try {
    return 'Last block processed - ' + dayjs(ts).fromNow();
  } catch (_) {
    return 'Testnet might be experiencing downtime!';
  }
}

export default TestnetStatusIcon;
