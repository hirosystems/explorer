'use client';

import React from 'react';

import { Connect } from '@stacks/connect-react';

import { useAppSelector } from '../../common/state/hooks';
import { selectUserSession } from '../sandbox/sandbox-slice';

export const StacksAuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const userSession = useAppSelector(selectUserSession);

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
