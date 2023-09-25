'use client';

import { CONNECT_AUTH_ORIGIN } from '@/common/constants';
import { useAppDispatch, useAppSelector } from '@/common/state/hooks';
import { Box, Button, Flex, IconButton, Input, Stack, Tooltip } from '@/ui/components';
import { Caption, Title } from '@/ui/typography';
import React, { FC, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { TbTools } from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import { FiExternalLink } from 'react-icons/fi';

import { openContractDeploy } from '@stacks/connect';

import { useRandomName } from '../../common/hooks/use-random-name';
import { useStacksNetwork } from '../../common/hooks/use-stacks-network';
import { useUser } from '../hooks/useUser';
import { selectCodeBody, setUserData, toggleCodeToolbar } from '../sandbox-slice';

export const LeftSection: FC = () => {
  const dispatch = useAppDispatch();
  const randomName = useRandomName();
  const { isConnected, connect } = useUser();
  const network = useStacksNetwork();
  const [contractName, setContractName] = useState(randomName());
  const codeBody = useAppSelector(selectCodeBody);
  const queryClient = useQueryClient();

  const onDeploy = React.useCallback(() => {
    void openContractDeploy({
      network,
      postConditionMode: 0x01,
      codeBody,
      contractName,
      authOrigin: CONNECT_AUTH_ORIGIN,
      onFinish: () => {
        void queryClient.invalidateQueries({ queryKey: ['addressMempoolTxsInfinite'] });
      },
    });
  }, [codeBody, contractName, network, queryClient]);
  return (
    <>
      <Title mb="32px" fontSize="24px">
        Write & Deploy
      </Title>
      <Caption mb="8px">Contract name</Caption>
      <Flex
        border="1px solid transparent"
        alignItems="center"
        borderRadius="24px"
        position="relative"
      >
        <Input
          as="input"
          value={contractName}
          onChange={(e: any) => setContractName(e.target?.value as string)}
          placeholder="Name your contract"
          pr="84px"
          color={'textBody'}
        />
        <Flex position="absolute" right="44px">
          <IconButton
            color={'textBody'}
            onClick={() => {
              setContractName('');
            }}
            icon={<RiCloseLine size={'16px'} />}
            aria-label={'clear contract name field'}
            size={'30px'}
          />
        </Flex>
        <Box onClick={() => dispatch(toggleCodeToolbar())}>
          <Tooltip label="Contract tools">
            <IconButton
              icon={<TbTools size={'16px'} />}
              aria-label={'contract tools'}
              size={'40px'}
            />
          </Tooltip>
        </Box>
      </Flex>
      <Stack alignItems="center" justifyContent={'center'} isInline spacing="8px" mt="20px">
        <Button
          onClick={() =>
            isConnected
              ? onDeploy()
              : connect({
                  onFinish: authData => {
                    dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                  },
                })
          }
          width="100%"
        >
          {isConnected ? 'Deploy' : 'Connect Stacks Wallet'}
        </Button>
      </Stack>
      <Stack mt={'10px'}>
        <Button
          color={'textBody'}
          variant="outline"
          _hover={{ background: '#F9F9FA' }}
          bg={'bg'}
          rightIcon={<FiExternalLink />}
          onClick={() => {
            const paramsBase64 = { name: contractName, sourceCode: codeBody };
            const state = btoa(JSON.stringify(paramsBase64));

            // 'state' param is used by Auth0 to forward the params after the login portal
            window.open(`https://platform.hiro.so/projects/import?state=${state}`);
          }}
          width="100%"
        >
          Save Contract in Hiro Platform
        </Button>
      </Stack>
    </>
  );
};
