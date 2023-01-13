'use client';

import { ONE_MINUTE } from '@/app/common/queries/query-stale-time';
import { getNetworkModeFromNetworkId } from '@/common/api/utils';
import { Badge } from '@/common/components/Badge';
import { DEFAULT_V2_INFO_ENDPOINT, MODALS } from '@/common/constants';
import { useGlobalContext } from '@/common/context/useAppContext';
import { useAppDispatch } from '@/common/state/hooks';
import { Network } from '@/common/types/network';
import { openModal } from '@/components/modals/modal-slice';
import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  IconButton,
  Spinner,
  Stack,
  Tooltip,
} from '@/ui/components';
import { Caption, Title } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { TbCheck, TbTrash } from 'react-icons/tb';
import { useQuery } from 'react-query';

import { CoreNodeInfoResponse } from '@stacks/blockchain-api-client/src/generated/models';
import { ChainID } from '@stacks/transactions';

interface ItemWrapperProps extends FlexProps {
  isDisabled?: string | boolean;
  isActive?: boolean;
}

const ItemWrapper: React.FC<ItemWrapperProps> = ({ isActive, isDisabled, ...props }) => {
  return (
    <Flex
      opacity={isDisabled ? 0.5 : 1}
      alignItems="center"
      justifyContent="space-between"
      position="relative"
      zIndex="999"
      bg={isDisabled ? 'bg-4' : 'bg'}
      cursor={isDisabled ? 'not-allowed' : 'unset'}
      _hover={{
        bg: isDisabled ? 'unset' : isActive ? 'unset' : 'bgAlt',
        cursor: isDisabled ? 'not-allowed' : isActive ? 'default' : 'pointer',
      }}
      {...props}
    />
  );
};

interface ItemProps extends ItemWrapperProps {
  item: Network;
  isCustom?: boolean;
}

const getCustomNetworkApiInfo = (baseUrl: string) => () =>
  fetch(`${baseUrl}${DEFAULT_V2_INFO_ENDPOINT}`).then(res => res.json());

const Item: React.FC<ItemProps> = ({ item, isActive, isDisabled, onClick, isCustom, ...rest }) => {
  const {
    removeCustomNetwork,
    apiUrls: { mainnet, testnet },
  } = useGlobalContext();
  const colorMode = useColorMode().colorMode;
  const isMainnet = item.url === mainnet;
  const isTestnet = item.url === testnet;
  const isDefault = isMainnet || isTestnet;
  let itemNetworkId: ChainID.Mainnet | ChainID.Testnet = isMainnet
    ? ChainID.Mainnet
    : ChainID.Testnet;

  const doNotFetch = isDisabled || !item.url || isDefault;

  const { data, error, isLoading } = useQuery<CoreNodeInfoResponse, Error>(
    ['customNetworkApiInfo', item.url],
    getCustomNetworkApiInfo(item.url),
    {
      staleTime: ONE_MINUTE,
      enabled: !doNotFetch,
      suspense: false,
      useErrorBoundary: false,
    }
  );

  if (!isDefault && data) {
    itemNetworkId = data?.network_id && parseInt(data.network_id.toString());
  }

  const itemNetworkMode = getNetworkModeFromNetworkId(itemNetworkId);

  return (
    <ItemWrapper isActive={isActive} isDisabled={!!isDisabled || !!error || isLoading} {...rest}>
      <Stack
        pl="32px"
        pr={'32px'}
        py="16px"
        width="100%"
        flexGrow={1}
        spacing="8px"
        onClick={onClick}
      >
        <Flex alignItems="center">
          <Title display="block">{item.label}</Title>
          {itemNetworkMode ? (
            <Badge bg={`bg4.${colorMode}`} ml="8px" color={`textCaption.${colorMode}`}>
              {itemNetworkMode}
            </Badge>
          ) : null}
        </Flex>
        <Caption display="block">
          {item?.url?.includes('//') ? item?.url?.split('//')[1] : item?.url || isDisabled}
        </Caption>
      </Stack>
      <Flex alignItems="center" pr={'32px'} py="16px" position={'relative'}>
        {isCustom && !isActive ? (
          <Tooltip label="Remove network">
            <IconButton
              position="relative"
              zIndex={999}
              color={`textCaption.${colorMode}`}
              size={'21px'}
              icon={
                <span>
                  <TbTrash size={'21px'} />
                </span>
              }
              onClick={() => removeCustomNetwork(item)}
              aria-label={'Remove network'}
              _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
            />
          </Tooltip>
        ) : isLoading ? (
          <Spinner size="18px" opacity={0.5} color={'#666'} />
        ) : !!error ? (
          <Caption color={`feedbackError.${colorMode}`}>Offline</Caption>
        ) : isActive ? (
          <Box as={TbCheck} color={`feedbackSuccess.${colorMode}`} size="18px" />
        ) : null}
      </Flex>
    </ItemWrapper>
  );
};

const AddNetwork: React.FC<ItemWrapperProps> = ({ onClick, ...rest }) => {
  const dispatch = useAppDispatch();

  return (
    <ItemWrapper
      onClick={e => {
        dispatch(openModal(MODALS.ADD_NETWORK));
        onClick?.(e);
      }}
      py="24px"
      px="32px"
      borderTopWidth="1px"
      {...rest}
    >
      <Title fontWeight={400}>Add a network</Title>
    </ItemWrapper>
  );
};

interface NetworkItemsProps extends BoxProps {
  onItemClick?: (item?: any) => void;
}

export const NetworkItems: React.FC<NetworkItemsProps> = React.memo(({ onItemClick }) => {
  const { networks, activeNetwork } = useGlobalContext();
  const router = useRouter();

  return (
    <>
      {Object.values<Network>(networks).map((network, key) => {
        const isActive = activeNetwork.url === network.url;
        return (
          <Item
            isActive={isActive}
            item={network}
            key={key}
            data-test={`network-${network}`}
            isCustom={key >= 3}
            onClick={() => {
              setTimeout(() => {
                onItemClick?.(network);
                if (!isActive) {
                  void router
                    .push(
                      `/?chain=${network.mode}${
                        network.isCustomNetwork ? `&api=${network.url}` : ''
                      }`
                    )
                    .then(() => router.reload());
                }
              }, 250);
            }}
          />
        );
      })}
      <AddNetwork
        onClick={() => {
          onItemClick?.();
        }}
      />
    </>
  );
});
