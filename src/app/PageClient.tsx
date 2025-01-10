'use client';

import { useColorModeValue, useToast } from '@chakra-ui/react';
import { ArrowDownRight, ArrowUpRight, Bell, BellSlash, X } from '@phosphor-icons/react';
import { icon } from 'leaflet';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { connectWebSocketClient } from '@stacks/blockchain-api-client';

import { TxLink } from '../common/components/ExplorerLinks';
import { DEFAULT_LIST_LIMIT_SMALL, TransactionType } from '../common/constants/constants';
import { useGlobalContext } from '../common/context/useGlobalContext';
import { getOrCreateUserId } from '../common/utils/utils';
import { TxListTabs } from '../features/txs-list/tabs/TxListTabs';
import { Box } from '../ui/Box';
import { Checkbox } from '../ui/Checkbox';
import { Flex } from '../ui/Flex';
import { FormControl } from '../ui/FormControl';
import { FormLabel } from '../ui/FormLabel';
import { Grid } from '../ui/Grid';
import { HStack } from '../ui/HStack';
import { Icon } from '../ui/Icon';
import { Switch } from '../ui/Switch';
import { Tag } from '../ui/Tag';
import { Text } from '../ui/Text';
import { HomePageBlockListSkeleton } from './_components/BlockList/Grouped/skeleton';
import FloatingAlert from './_components/FlaotingAlert';
import { PageTitle } from './_components/PageTitle';
import { Stats } from './_components/Stats/Stats';

const txTypeNamesMap = {
  [TransactionType.SMART_CONTRACT]: 'Contract deploy',
  [TransactionType.CONTRACT_CALL]: 'Function call',
  [TransactionType.TOKEN_TRANSFER]: 'Token transfer',
  [TransactionType.COINBASE]: 'Coinbase',
  [TransactionType.POISON_MICROBLOCK]: 'Poison-microblock',
  tenure_change: 'Tenure change',
};

const FORCED_EXPLORATION_PROB = 0.5; // 50% chance to explore

const HomePageBlockListDynamic = dynamic(
  () =>
    import('./_components/BlockList/HomePage/HomePageBlockList').then(mod => mod.HomePageBlockList),
  {
    loading: () => <HomePageBlockListSkeleton />,
    ssr: false,
  }
);

const getRandomTxId = () => {
  return '0x' + Math.random().toString(16).substr(2, 64);
};

const getRandomAddress = () => {
  return 'SP' + Math.random().toString(16).substr(2, 38);
};

const allTxTypes = ['token_transfer', 'contract_call'];

const getRandomTxType = () => {
  return allTxTypes[Math.floor(Math.random() * allTxTypes.length)];
};

const getRandomTx = () => {
  return {
    tx_id: getRandomTxId(),
    nonce: 2301,
    fee_rate: '3000',
    sender_address: getRandomAddress(),
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'any',
    tx_status: 'pending',
    receipt_time: 1736454988,
    receipt_time_iso: '2025-01-09T20:36:28.000Z',
    tx_type: getRandomTxType(),
    burn_block_time: 1736454988,
    token_transfer: {
      amount: 200000,
      recipient_address: getRandomAddress(),
    },
    contract_call: {
      contract_id: getRandomAddress(),
    },
  };
};

function NotificationFloatingButton({ isActive, isShown, toggleIsActive, toggleIsShown }: any) {
  if (!isShown) {
    return (
      <Flex
        gap={'9px'}
        direction={'column'}
        position={'fixed'}
        right={'20px'}
        bottom={'20px'}
        zIndex={100}
        alignItems={'flex-end'}
      >
        <Flex
          width={'48px'}
          height={'40px'}
          boxShadow={'0px 8px 16px 0px rgba(27, 32, 36, 0.10)'}
          borderRadius={'30px'}
          backgroundColor={isActive ? 'slate.900' : 'slate.700'}
          color={'white'}
          onClick={() => {
            toggleIsShown();
          }}
          alignItems={'center'}
          justifyContent={'center'}
          cursor={'pointer'}
        >
          <Icon as={isActive ? Bell : BellSlash} color={'white'} />
        </Flex>
      </Flex>
    );
  }
  return (
    <>
      <Box
        backgroundColor={'blackAlpha.300'}
        width={'100vw'}
        height={'100vh'}
        position={'fixed'}
        zIndex={'50'}
        top={'0'}
        left={'0'}
        onClick={() => {
          toggleIsShown();
        }}
      />
      <Flex
        gap={'9px'}
        direction={'column'}
        position={'fixed'}
        right={'20px'}
        bottom={'20px'}
        zIndex={100}
        alignItems={'flex-end'}
      >
        <Flex
          background={'white'}
          color={'slate.700'}
          borderRadius={'16px'}
          boxShadow={'0px 8px 16px 0px rgba(27, 32, 36, 0.10)'}
          gap={'24px'}
          direction={'column'}
          padding={'32px'}
        >
          <FormControl display="flex" alignItems="center" gap={3} width="fit-content">
            <Switch id="smart-notification" onChange={toggleIsActive} isChecked={isActive} />
            <FormLabel htmlFor="smart-notification" m="0" lineHeight={'1.5em'} fontSize={'20px'}>
              Smart notifications
            </FormLabel>
          </FormControl>
          <Flex gap={'0px'} direction={'column'}>
            <Text mb={'10px'}>Notify me of:</Text>
            <HStack
              gap={2}
              as="label"
              width={'full'}
              py={3}
              _hover={{ bg: useColorModeValue('slate.100', 'slate.800') }}
              rounded={'lg'}
              alignItems={'flex-start'}
            >
              <Checkbox isChecked={isActive} variant="outline" onChange={toggleIsActive} />
              <Text fontSize={'sm'}>Relevant transactions (AI-Powered)</Text>
            </HStack>
            <HStack
              gap={2}
              as="label"
              width={'full'}
              py={3}
              _hover={{ bg: useColorModeValue('slate.100', 'slate.800') }}
              rounded={'lg'}
            >
              <Checkbox isChecked={false} variant="outline" disabled />
              <Text fontSize={'sm'}>Large value transactions</Text>
            </HStack>
            <HStack
              gap={2}
              as="label"
              width={'full'}
              py={3}
              _hover={{ bg: useColorModeValue('slate.100', 'slate.800') }}
              rounded={'lg'}
            >
              <Checkbox isChecked={false} variant="outline" disabled />
              <Text fontSize={'sm'}>Interactions with top contracts</Text>
            </HStack>
          </Flex>
        </Flex>
        <Flex
          width={'48px'}
          height={'40px'}
          boxShadow={'0px 8px 16px 0px rgba(27, 32, 36, 0.10)'}
          borderRadius={'30px'}
          backgroundColor={isActive ? 'slate.900' : 'slate.700'}
          color={'white'}
          onClick={() => {
            toggleIsShown();
          }}
          alignItems={'center'}
          justifyContent={'center'}
          cursor={'pointer'}
        >
          <Icon as={isActive ? Bell : BellSlash} color={'white'} />
        </Flex>
      </Flex>
    </>
  );
}

const Home: NextPage = () => {
  const { activeNetwork } = useGlobalContext();
  const toast = useToast();
  const intervalRef = useRef(null);
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  useEffect(() => {
    if (intervalRef.current !== null || !isNotificationActive) {
      return;
    }

    intervalRef.current = setInterval(async () => {
      const tx = getRandomTx();
      const eventData: any = {
        ...tx,
      };

      if (tx.tx_type === 'token_transfer' && tx.token_transfer) {
        eventData.token_transfer = {
          amount: tx.token_transfer.amount,
          recipient_address: tx.token_transfer.recipient_address,
        };
      } else if (tx.tx_type === 'contract_call' && tx.contract_call) {
        eventData.contract_call = {
          contract_id: tx.contract_call.contract_id,
        };
      }

      const userId = getOrCreateUserId();
      const response = await fetch('/decideNotification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          eventData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Decision:', data);

      const shouldExplore = Math.random() < FORCED_EXPLORATION_PROB;
      const finalAction = shouldExplore ? 1 : data.action;

      if (finalAction === 1) {
        toast({
          title: 'New Transaction Alert',
          description:
            eventData.tx_type === 'token_transfer'
              ? `Amount: ${eventData.token_transfer.amount}\nRecipient: ${eventData.token_transfer.recipient_address}`
              : `Contract ID: ${eventData.contract_call.contract_id}`,
          status: 'info',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
          max: 3,
          render: ({ onClose }) => (
            <Flex
              direction={'column'}
              gap={'12px'}
              color="white"
              p={'16px 12px 16px 20px'}
              bg="blackAlpha.800"
              borderRadius={'8px'}
              borderWidth={'1px'}
              borderColor={'black'}
              minWidth={'400px'}
            >
              <Flex align={'center'} justify={'space-between'}>
                <Flex gap={'6px'} align={'center'}>
                  <Icon as={Bell} color={'purple.300'} />
                  <TxLink
                    txId={tx.tx_id}
                    fontSize={'12px'}
                    color={'purple.300'}
                    fontWeight={'500'}
                    target={'_blank'}
                    onClick={async () => {
                      // Send positive reward when user clicks the TxLink
                      await fetch('/interaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userId,
                          action: 1, // The action corresponding to showing the notification
                          context: data.features,
                          reward: 1, // Positive reward for clicking the notification
                        }),
                      });
                      console.log('✅ Click interaction recorded.');
                    }}
                  >
                    New transaction alert from {eventData.sender_address.slice(0, 6)}...
                  </TxLink>
                </Flex>
                <Icon
                  as={X}
                  color={'white'}
                  onClick={async () => {
                    // Send negative reward when user dismisses the toast
                    await fetch('/interaction', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId,
                        action: 1, // The action corresponding to showing the notification
                        context: data.features,
                        reward: 0, // Neutral or negative reward for dismissing
                      }),
                    });
                    console.log('⚠️ Dismiss interaction recorded.');
                    onClose(); // Close the toast after recording dismiss
                  }}
                />
              </Flex>
              <Flex gap={'6px'} align={'center'}>
                <Tag bg={'black'} fontSize={'12px'}>
                  {txTypeNamesMap[eventData.tx_type]}
                </Tag>
                <Tag bg={'black'} fontSize={'12px'}>
                  ID: {tx.tx_id.slice(0, 6)}...{tx.tx_id.slice(-6)}
                </Tag>
              </Flex>
              <Flex gap={'4px'} align={'center'}>
                <Icon as={ArrowUpRight} color={'slate.500'} />
                <Text fontSize={'12px'} color={'slate.500'}>
                  Sender:
                </Text>
                <Text fontSize={'12px'} color={'white'} textDecoration={'underline'}>
                  {eventData.sender_address.slice(0, 6)}...{eventData.sender_address.slice(-6)}
                </Text>
              </Flex>
              <Flex gap={'4px'} align={'center'}>
                <Icon as={ArrowDownRight} color={'slate.500'} />
                <Text fontSize={'12px'} color={'slate.500'}>
                  Recipient:
                </Text>
                <Text fontSize={'12px'} color={'white'} textDecoration={'underline'}>
                  {eventData.tx_type === 'token_transfer'
                    ? `${eventData.token_transfer.recipient_address.slice(0, 6)}...`
                    : 'N/A'}
                </Text>
              </Flex>
            </Flex>
          ),
        });
      }

      if (data.action === 1) {
        console.log('show notification!', eventData);
      }
    }, 3000);

    console.log('interval on!');

    return () => {
      clearInterval(intervalRef.current as any);
      intervalRef.current = null;
      console.log('Interval has been cleared.');
    };
  }, [isNotificationActive, isNotificationShown]);

  connectWebSocketClient('wss://api.mainnet.hiro.so/').then(client => {
    client.subscribeMempool(async tx => {
      // console.log('new Transaction:', tx);
    });
  });

  return (
    <>
      <NotificationFloatingButton
        isActive={isNotificationActive}
        isShown={isNotificationShown}
        toggleIsShown={() => setIsNotificationShown(!isNotificationShown)}
        toggleIsActive={() => setIsNotificationActive(!isNotificationActive)}
      />
      <FloatingAlert />
      <PageTitle data-test="homepage-title">Stacks Explorer</PageTitle>
      {!activeNetwork.isSubnet && <Stats />}
      <Grid
        gap="7"
        width="full"
        gridTemplateColumns={['100%', '100%', '100%', 'minmax(0, 0.6fr) minmax(0, 0.4fr)']}
      >
        <TxListTabs
          limit={DEFAULT_LIST_LIMIT_SMALL}
          showFilterButton={false}
          showValueMenu={false}
        />
        <HomePageBlockListDynamic />
      </Grid>
    </>
  );
};

export default Home;
