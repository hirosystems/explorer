import { useCallback, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { TbTools } from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';

import { openContractDeploy } from '@stacks/connect';
import { Caption, Title } from '@/ui/typography';
import { Box, Button, Flex, IconButton, Input, Spinner, Stack, Tooltip } from '@/ui/components';
import { useAppDispatch, useAppSelector } from '@/common/state/hooks';
import { CONNECT_AUTH_ORIGIN } from '@/common/constants';

import { useRandomName } from '../../common/hooks/use-random-name';
import { useStacksNetwork } from '../../common/hooks/use-stacks-network';
import { useUser } from '../hooks/useUser';
import { selectCodeBody, setUserData, toggleCodeToolbar } from '../sandbox-slice';

export function LeftSection() {
  const dispatch = useAppDispatch();
  const randomName = useRandomName();
  const { isConnected, connect, isFetching } = useUser();
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

  if (isFetching) {
    return <Spinner alignSelf={'center'} justifySelf={'center'} size={'32px'} />;
  }
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
          color="textBody"
        />
        <Flex position="absolute" right="8px">
          <IconButton
            color="textBody"
            onClick={() => {
              setContractName('');
            }}
            icon={<RiCloseLine size="16px" />}
            aria-label="clear contract name field"
            size="30px"
          />
        </Flex>
      </Flex>
      <Stack alignItems="center" justifyContent="center" isInline spacing="8px" mt="20px">
        <Box onClick={() => dispatch(toggleCodeToolbar())}>
          <Tooltip label="Contract tools">
            <IconButton icon={<TbTools size="16px" />} aria-label="contract tools" size="40px" />
          </Tooltip>
        </Box>
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
    </>
  );
}
