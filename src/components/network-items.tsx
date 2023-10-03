import { useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { TbCheck, TbTrash } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { CoreNodeInfoResponse } from '@stacks/blockchain-api-client/src/generated/models';
import { ChainID } from '@stacks/transactions';
import { ONE_MINUTE } from '@/appPages/common/queries/query-stale-time';
import { getQueryParams } from '@/appPages/common/utils/buildUrl';
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

interface ItemWrapperProps extends FlexProps {
  isDisabled?: string | boolean;
  isActive?: boolean;
}

function ItemWrapper({ isActive, isDisabled, ...props }: ItemWrapperProps) {
  return (
    <Flex
      opacity={isDisabled ? 0.5 : 1}
      alignItems="center"
      justifyContent="space-between"
      position="relative"
      bg={isDisabled ? 'bg-4' : 'bg'}
      cursor={isDisabled ? 'not-allowed' : 'unset'}
      _hover={{
        bg: isDisabled ? 'unset' : isActive ? 'unset' : 'bgAlt',
        cursor: isDisabled ? 'not-allowed' : isActive ? 'default' : 'pointer',
      }}
      {...props}
    />
  );
}

interface ItemProps extends ItemWrapperProps {
  item: Network;
  isCustom?: boolean;
}

const getCustomNetworkApiInfo = (baseUrl: string) => () =>
  fetch(`${baseUrl}${DEFAULT_V2_INFO_ENDPOINT}`).then(res => res.json());

function Item({ item, isActive, isDisabled, onClick, isCustom, ...rest }: ItemProps) {
  const {
    removeCustomNetwork,
    apiUrls: { mainnet, testnet },
  } = useGlobalContext();
  const { colorMode } = useColorMode();
  const isMainnet = item.url === mainnet;
  const isTestnet = item.url === testnet;
  const isDefault = isMainnet || isTestnet;
  let itemNetworkId: ChainID.Mainnet | ChainID.Testnet = isMainnet
    ? ChainID.Mainnet
    : ChainID.Testnet;

  const doNotFetch = isDisabled || !item.url || isDefault;

  const { data, error, isFetching } = useQuery<CoreNodeInfoResponse, Error>(
    ['customNetworkApiInfo', item.url],
    getCustomNetworkApiInfo(item.url),
    {
      staleTime: ONE_MINUTE,
      enabled: !doNotFetch,
      useErrorBoundary: false,
    }
  );

  if (!isDefault && data) {
    itemNetworkId = data?.network_id && parseInt(data.network_id.toString());
  }

  const itemNetworkMode = getNetworkModeFromNetworkId(itemNetworkId);

  return (
    <ItemWrapper isActive={isActive} isDisabled={!!isDisabled || !!error || isFetching} {...rest}>
      <Stack
        pl="32px"
        pr="32px"
        py="16px"
        width="100%"
        flexGrow={1}
        spacing="8px"
        onClick={onClick}
      >
        <Flex alignItems="center">
          <Title display="block">{item.label}</Title>
          {item.isSubnet ? (
            <Badge bg={`bg4.${colorMode}`} ml="8px" color={`textCaption.${colorMode}`}>
              subnet
            </Badge>
          ) : itemNetworkMode ? (
            <Badge bg={`bg4.${colorMode}`} ml="8px" color={`textCaption.${colorMode}`}>
              {itemNetworkMode}
            </Badge>
          ) : null}
        </Flex>
        <Caption display="block">
          {item?.url?.includes('//') ? item?.url?.split('//')[1] : item?.url || isDisabled}
        </Caption>
      </Stack>
      <Flex alignItems="center" pr="32px" py="16px" position="relative">
        {isCustom && !isActive ? (
          <Tooltip label="Remove network">
            <IconButton
              position="relative"
              color={`textCaption.${colorMode}`}
              size="21px"
              icon={
                <span>
                  <TbTrash size="21px" />
                </span>
              }
              onClick={() => removeCustomNetwork(item)}
              aria-label="Remove network"
              _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
            />
          </Tooltip>
        ) : isFetching ? (
          <Spinner size="18px" opacity={0.5} color="#666" />
        ) : error ? (
          <Caption color={`feedbackError.${colorMode}`}>Offline</Caption>
        ) : isActive ? (
          <Box as={TbCheck} color={`feedbackSuccess.${colorMode}`} size="18px" />
        ) : null}
      </Flex>
    </ItemWrapper>
  );
}

function AddNetwork({ onClick, ...rest }: ItemWrapperProps) {
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
}

interface NetworkItemsProps extends BoxProps {
  onItemClick?: (item?: any) => void;
}

export const NetworkItems = memo(({ onItemClick }: NetworkItemsProps) => {
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
                  void router.push(`/${getQueryParams(network)}`).then(() => router.reload());
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
