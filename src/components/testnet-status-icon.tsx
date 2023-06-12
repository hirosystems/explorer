import React from 'react';
import { Icon, Spinner } from '@/ui/components';
import { FlaskIcon, ExclamationCircleIcon } from '@/ui/icons';
import { SYSTEM_STATUS_URL } from '@/common/constants';
import { useColorMode } from '@chakra-ui/react';
import { useTestnetStatus } from '@/app/common/queries/useTestnetStatus';

export const TestnetPendingIcon = (): React.ReactElement => {
  const colorMode = useColorMode().colorMode;
  return <Spinner color={`brand.${colorMode}`} size="16px" mr="4px" />;
};

const TestnetStatusIcon = (): React.ReactElement => {
  const redirectToStatusPage = () => window.open(SYSTEM_STATUS_URL, '_blank');
  const colorMode = useColorMode().colorMode;
  const { isLoading, error, data } = useTestnetStatus();

  if (isLoading) return <TestnetPendingIcon />;

  const showWarn = error || !data || data.status != 'ready';
  if (showWarn)
    return (
      <Icon
        as={ExclamationCircleIcon}
        color={'orange'}
        size="16px"
        mr="4px"
        onClick={redirectToStatusPage}
      />
    );

  return <Icon as={FlaskIcon} color={`brand.${colorMode}`} size="16px" mr="4px" />;
};

export default TestnetStatusIcon;
