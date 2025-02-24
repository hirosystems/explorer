'use client';

import { Box, Button, Flex, Icon, Stack } from '@chakra-ui/react';
import { ArrowSquareOut, Toolbox, X } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { openContractDeploy } from '@stacks/connect';

import { CONNECT_AUTH_ORIGIN } from '../../../common/constants/env';
import { useRandomName } from '../../../common/hooks/useRandomName';
import { useStacksNetwork } from '../../../common/hooks/useStacksNetwork';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import { InputGroup } from '../../../components/ui/input-group';
import { IconButton } from '../../../ui/IconButton';
import { Input } from '../../../ui/Input';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';
import { Tooltip } from '../../../ui/Tooltip';
import { Caption, Title } from '../../../ui/typography';
import { useUser } from '../hooks/useUser';
import { selectCodeBody, setUserData, toggleCodeToolbar } from '../sandbox-slice';

export function LeftSection() {
  const dispatch = useAppDispatch();
  const randomName = useRandomName();
  const { isConnected, connect } = useUser();
  const network = useStacksNetwork();
  const [contractName, setContractName] = useState(randomName());
  const codeBody = useAppSelector(selectCodeBody);
  const queryClient = useQueryClient();

  const onDeploy = useCallback(() => {
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
      <Stack gap={3}>
        <Stack gap={5}>
          <Flex>
            <InputGroup
              border="1px solid transparent"
              alignItems="center"
              borderRadius="xl"
              position="relative"
              w="full"
              endElement={
                <IconButton
                  onClick={() => {
                    setContractName('');
                  }}
                  aria-label={'clear contract name field'}
                >
                  <Icon h={4} w={4} color="icon">
                    <X />
                  </Icon>
                </IconButton>
              }
            >
              <Input
                value={contractName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContractName(e.target?.value)
                }
                placeholder="Name your contract"
                pr={21}
                w="full"
              />
            </InputGroup>
            <Box onClick={() => dispatch(toggleCodeToolbar())}>
              <Tooltip content="Contract tools">
                <IconButton aria-label={'contract tools'} size={10}>
                  <Icon h={4} w={4} color="icon">
                    <Toolbox />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Box>
          </Flex>
          <Stack alignItems="center" justifyContent={'center'} gap={2}>
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
              variant={'primary'}
            >
              {isConnected ? 'Deploy' : 'Connect Stacks Wallet'}
            </Button>
          </Stack>
        </Stack>
        <Stack gap={2}>
          <Text fontSize="xs" as="p">
            The sandbox doesn't support Clarity 3 deployments. To deploy a Clarity 3 contract,
            please use{' '}
            <TextLink
              display="inline"
              href="https://docs.hiro.so/stacks/clarinet/guides/deploy-a-contract"
              target="_blank"
              _hover={{ textDecoration: 'underline' }}
            >
              Clarinet
            </TextLink>{' '}
            or the{' '}
            <TextLink
              display="inline"
              href="https://docs.hiro.so/stacks/platform/guides/deployment-plans"
              target="_blank"
              _hover={{ textDecoration: 'underline' }}
            >
              Hiro platform
            </TextLink>{' '}
            instead.
          </Text>
        </Stack>
      </Stack>
    </>
  );
}
