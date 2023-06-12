import React, { useEffect, useState } from 'react';
import { Icon, Spinner } from '@/ui/components';
import { useColorMode } from '@chakra-ui/react';
import { FlaskIcon, ExclamationCircleIcon } from '@/ui/icons';
import { useAppSelector } from '@/common/state/hooks';
import { testnetStatusSelector, TestnetStatus } from './testnet-availability-slice';
import { SYSTEM_STATUS_URL } from '@/common/constants';

export const TestnetAvailibityIcon = (): React.ReactElement => {
  const colorMode = useColorMode().colorMode;
  const status = useAppSelector(testnetStatusSelector);

  const redirectToStatusPage = () => window.open(SYSTEM_STATUS_URL, '_blank');

  switch (status) {
    case TestnetStatus.available:
      return <Icon as={FlaskIcon} color={`brand.${colorMode}`} size="16px" mr="4px" />;
    case TestnetStatus.unavailable:
      return (
        <Icon
          as={ExclamationCircleIcon}
          color={'orange'}
          size="16px"
          mr="4px"
          onClick={redirectToStatusPage}
        />
      );
    default:
    case TestnetStatus.pending:
    case TestnetStatus.uninitialized:
      return <Spinner color={`brand.${colorMode}`} size="16px" mr="4px" />;
  }
};
