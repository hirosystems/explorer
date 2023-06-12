import React from 'react';
import { Icon, Spinner } from '@/ui/components';
import { FlaskIcon, ExclamationCircleIcon } from '@/ui/icons';
import { SYSTEM_STATUS_URL } from '@/common/constants';
import { useQuery } from 'react-query';
import { useColorMode } from '@chakra-ui/react';

export const TestnetPendingIcon = (): React.ReactElement => {
  const colorMode = useColorMode().colorMode;
  return <Spinner color={`brand.${colorMode}`} size="16px" mr="4px" />;
};

const TestnetAvailibityIcon = (): React.ReactElement => {
  const redirectToStatusPage = () => window.open(SYSTEM_STATUS_URL, '_blank');
  const colorMode = useColorMode().colorMode;
  const { isLoading, error, data } = useQuery(['testnetstatus', 'testnetstatus'], () =>
    window.fetch('https://api.testnet.hiro.so/extended/v1/status').then(res => res.json())
  );

  if (isLoading) return <TestnetPendingIcon />;

  const showWarn = error || data.status != 'ready';
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

export default TestnetAvailibityIcon;
