'use client';

import { ArrowSquareOut, Toolbox, X } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { openContractDeploy } from '@stacks/connect';

import { CONNECT_AUTH_ORIGIN } from '../../../common/constants/env';
import { useRandomName } from '../../../common/hooks/useRandomName';
import { useStacksNetwork } from '../../../common/hooks/useStacksNetwork';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
import { Input } from '../../../ui/Input';
import { InputGroup } from '../../../ui/InputGroup';
import { InputRightElement } from '../../../ui/InputRightElement';
import { Stack } from '../../../ui/Stack';
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
              borderRadius="24px"
              position="relative"
            >
              <Input
                value={contractName}
                onChange={(e: any) => setContractName(e.target?.value as string)}
                placeholder="Name your contract"
                pr="84px"
              />
              <InputRightElement>
                <IconButton
                  onClick={() => {
                    setContractName('');
                  }}
                  icon={<Icon as={X} size={4} />}
                  aria-label={'clear contract name field'}
                />
              </InputRightElement>
            </InputGroup>
            <Box onClick={() => dispatch(toggleCodeToolbar())}>
              <Tooltip label="Contract tools">
                <IconButton
                  icon={<Icon as={Toolbox} size={4} />}
                  aria-label={'contract tools'}
                  size={'40px'}
                />
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
          <Button
            variant="secondary"
            rightIcon={<ArrowSquareOut />}
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
          <Text fontSize="xs" as="p">
            The sandbox doesn't support Clarity 3 deployments. To deploy a Clarity 3 contract,
            please use{' '}
            <TextLink
              href="https://docs.hiro.so/stacks/clarinet/guides/deploy-a-contract"
              target="_blank"
              _hover={{ textDecoration: 'underline' }}
            >
              Clarinet
            </TextLink>{' '}
            or the{' '}
            <TextLink
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
