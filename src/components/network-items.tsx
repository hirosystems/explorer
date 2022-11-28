import React from 'react';

import { Box, BoxProps, color, Flex, FlexProps, IconButton, Stack, Tooltip } from '@stacks/ui';
import { IconCheck, IconTrash } from '@tabler/icons';

import { fetchFromApi } from '@common/api/fetch';
import { border } from '@common/utils';
import { Caption, Title } from '@components/typography';
import useSWR from 'swr';

import { DEFAULT_V2_INFO_ENDPOINT, MODALS } from '@common/constants';
import { Badge } from '@components/badge';

import { getNetworkModeFromNetworkId } from '@common/api/utils';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';
import {
  removeCustomNetwork,
  selectActiveNetwork,
  selectApiUrls,
  selectNetworks,
  setActiveNetwork,
} from '@common/state/network-slice';
import { Network } from '@common/types/network';
import { openModal } from '@components/modals/modal-slice';
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
        bg: isDisabled ? 'unset' : isActive ? 'unset' : color('bg-alt'),
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

const Item: React.FC<ItemProps> = ({ item, isActive, isDisabled, onClick, isCustom, ...rest }) => {
  const dispatch = useAppDispatch();
  const analytics = useAnalytics();
  const { mainnet, testnet } = useAppSelector(selectApiUrls);

  const isMainnet = item.url === mainnet;
  const isTestnet = item.url === testnet;
  const isDefault = isMainnet || isTestnet;
  let itemNetworkId: ChainID.Mainnet | ChainID.Testnet = isMainnet
    ? ChainID.Mainnet
    : ChainID.Testnet;

  const doNotFetch = isDisabled || !item.url || isDefault;

  const { data, error } = useSWR(!!doNotFetch ? null : item.url, async () => {
    // this will only run if the item url is not one of the defaults (mainnet/testnet)
    const response = await fetchFromApi(item.url)(DEFAULT_V2_INFO_ENDPOINT);
    return response.json();
  });

  // Custom network id
  if (!isDefault && data) {
    itemNetworkId = data?.network_id && parseInt(data?.network_id);
  }

  const itemNetworkMode = getNetworkModeFromNetworkId(itemNetworkId);

  const handleClick = React.useCallback(
    e => {
      analytics.track({
        event: 'network-selected',
        properties: {
          selectedNetworkUrl: item.url,
          time: Date.now(),
        },
      });

      onClick?.(e);
    },
    [itemNetworkMode]
  );

  return (
    <ItemWrapper isActive={isActive} isDisabled={!!isDisabled || !!error?.message} {...rest}>
      <Stack
        pl="extra-loose"
        pr={isCustom && !isActive ? 'unset' : 'extra-loose'}
        py="base"
        width="100%"
        flexGrow={1}
        spacing="tight"
        onClick={handleClick}
      >
        <Flex alignItems="center">
          <Title display="block">{item.label}</Title>
          {itemNetworkMode ? (
            <Badge bg={color('bg-4')} ml="tight" border={border()} color={color('text-caption')}>
              {itemNetworkMode}
            </Badge>
          ) : null}
        </Flex>
        <Caption display="block">
          {item?.url?.includes('//') ? item?.url?.split('//')[1] : item?.url || isDisabled}
        </Caption>
      </Stack>
      <Flex
        alignItems="center"
        pr={isCustom || isActive || !!error?.message ? 'extra-loose' : 'unset'}
        py="base"
      >
        {isCustom && !isActive ? (
          <>
            <Tooltip label="Remove network">
              <IconButton
                position="relative"
                zIndex={999}
                color={color('text-caption')}
                icon={IconTrash}
                onClick={() => dispatch(removeCustomNetwork(item))}
              />
            </Tooltip>
          </>
        ) : null}
        {isActive ? <Box as={IconCheck} color={color('feedback-success')} size="18px" /> : null}
        {!!error?.message ? <Caption color={color('feedback-error')}>Offline</Caption> : null}
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
      py="loose"
      px="extra-loose"
      borderTop={border()}
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
  const dispatch = useAppDispatch();
  const networks = Object.values<Network>(useAppSelector(selectNetworks));
  const activeNetwork = useAppSelector(selectActiveNetwork);

  return (
    <>
      {networks.map((network, key) => {
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
                  dispatch(setActiveNetwork(network));
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
