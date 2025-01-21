'use client';

import { Flex, Grid, HStack, Icon } from '@chakra-ui/react';
import { List, User } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Circle } from '../../common/components/Circle';
import { Section } from '../../common/components/Section';
import { useGlobalContext } from '../../common/context/useGlobalContext';
import { useAppDispatch, useAppSelector } from '../../common/state/hooks';
import { getQueryParams } from '../../common/utils/buildUrl';
import { Button } from '../../ui/Button';
import { IconButton } from '../../ui/IconButton';
import { Caption } from '../../ui/typography';
import { PageTitle } from '../_components/PageTitle';
import { useUser } from './hooks/useUser';
import { ConnectToStacks } from './layout/ConnectToStacks';
import { RightPanelSkeleton } from './layout/RightPanelSkeleton';
import { SideNav } from './layout/SideNav';
import { selectShowRightPanel, setUserData, toggleRightPanel } from './sandbox-slice';

const RightPanel = dynamic(() => import('./layout/RightPanel').then(mod => mod.RightPanel), {
  ssr: false,
  loading: () => <RightPanelSkeleton />,
});

export function Wrapper({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { isConnected, userData, connect } = useUser();
  const router = useRouter();
  const { activeNetwork } = useGlobalContext();
  const showRightPanel = useAppSelector(selectShowRightPanel);

  if (activeNetwork.isSubnet) {
    void router.replace(`/${getQueryParams(activeNetwork)}`);
    return null;
  }

  return (
    <>
      <PageTitle>Sandbox</PageTitle>
      <Section
        px={0}
        title={
          <Flex height={6} alignItems={'center'}>
            Stacks Explorer Sandbox
          </Flex>
        }
        topRight={
          !isConnected ? (
            <Button
              onClick={() =>
                connect({
                  onFinish: authData => {
                    dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                  },
                })
              }
              size="xs"
              fontSize="xs"
              variant="secondary"
              height={8}
            >
              Connect Stacks Wallet
            </Button>
          ) : (
            <HStack gap={6}>
              <HStack alignItems="center">
                <Circle h={5} w={5} color="borderSecondary">
                  <Icon h={3.5} w={3.5} color="surfaceOpposite">
                    <User />
                  </Icon>
                </Circle>
                <Caption>{userData?.identityAddress}</Caption>
                <IconButton
                  onClick={() => dispatch(toggleRightPanel())}
                  aria-label={'Toggle right panel'}
                  size={4}
                  color="surfaceOpposite"
                >
                  <List />
                </IconButton>
              </HStack>
            </HStack>
          )
        }
      >
        <Grid
          gridTemplateColumns={'var(--stacks-sizes-16) minmax(0, 1fr)'}
          gap={0}
          minHeight={'768px'}
        >
          <SideNav />
          {isConnected ? children : <ConnectToStacks />}
          {showRightPanel ? <RightPanel /> : null}
        </Grid>
      </Section>
    </>
  );
}
