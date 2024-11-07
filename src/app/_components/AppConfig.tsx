'use client';

import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

import { Connect } from '@stacks/connect-react';

import { useAppSelector } from '../../common/state/hooks';
import { NetworkMode } from '../../common/types/network';
import { Text } from '../../ui/Text';
import { selectUserSession } from '../sandbox/sandbox-slice';

export const AppConfig: React.FC<{
  queryNetworkMode: NetworkMode;
  queryApiUrl?: string;
  querySubnet?: string;
  children: React.ReactNode;
}> = ({ children, queryApiUrl, queryNetworkMode, querySubnet }) => {
  const userSession = useAppSelector(selectUserSession);
  useEffect(() => {
    toast(
      <Text fontSize={'sm'}>
        You're viewing {querySubnet ? 'a subnet' : `the ${queryNetworkMode}`}
        {querySubnet || queryApiUrl ? (
          <Box>
            <br />
            {querySubnet || queryApiUrl}
          </Box>
        ) : null}{' '}
        Explorer
      </Text>,
      {
        id: 'network-mode-toast',
        style: {
          textAlign: 'center',
        },
      }
    );
  }, []);

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'Stacks Explorer',
          icon: '/stx-circle.png',
        },
        userSession,
      }}
    >
      {children}
    </Connect>
  );
};
