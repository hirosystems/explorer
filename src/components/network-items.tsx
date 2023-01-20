import { IconCheck, IconTrash } from '@tabler/icons';
import React from 'react';
import useSWR from 'swr';

import { ChainID } from '@stacks/transactions';
import { Box, BoxProps, Flex, FlexProps, IconButton, Stack, Tooltip, color } from '@stacks/ui';

import { fetchFromApi } from '@common/api/fetch';
import { getNetworkModeFromNetworkId } from '@common/api/utils';
import { DEFAULT_V2_INFO_ENDPOINT, MODALS } from '@common/constants';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';
import {
  removeCustomNetwork,
  selectActiveNetwork,
  selectApiUrls,
  selectNetworks,
  setActiveNetwork,
} from '@common/state/network-slice';
import { Network, NetworkModes } from '@common/types/network';
import { border } from '@common/utils';

import { Badge } from '@components/badge';
import { openModal } from '@components/modals/modal-slice';
import { Caption, Title } from '@components/typography';

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
  networkItem: Network;
  isCustom?: boolean;
}

const NetworkItem: React.FC<ItemProps> = ({
  networkItem,
  isActive,
  isDisabled,
  onClick,
  isCustom,
  ...rest
}) => {
  const dispatch = useAppDispatch();
  const analytics = useAnalytics();
  const { mainnet, testnet } = useAppSelector(selectApiUrls);

  const isMainnet = networkItem.url === mainnet;
  const isTestnet = networkItem.url === testnet;
  const isDefault = isMainnet || isTestnet;
  let networkItemMode: NetworkModes | undefined = networkItem.mode;

  const doNotFetch = isDisabled || !networkItem.url || isDefault;

  const { data, error } = useSWR(!!doNotFetch ? null : networkItem.url, async () => {
    // this will only run if the item url is not one of the defaults (mainnet/testnet)
    const response = await fetchFromApi(networkItem.url)(DEFAULT_V2_INFO_ENDPOINT);
    return response.json();
  });

  // Custom network id
  if (!isDefault && data) {
    networkItemMode = getNetworkModeFromNetworkId(data?.network_id && parseInt(data?.network_id));
  }

  const handleClick = React.useCallback(
    e => {
      analytics.track({
        event: 'network-selected',
        properties: {
          selectedNetworkUrl: networkItem.url,
          time: Date.now(),
        },
      });

      onClick?.(e);
    },
    [analytics, networkItem.url, onClick]
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
          <Title display="block">{networkItem.label}</Title>
          {networkItemMode ? (
            <Badge bg={color('bg-4')} ml="tight" border={border()} color={color('text-caption')}>
              {networkItemMode}
            </Badge>
          ) : null}
        </Flex>
        <Caption display="block">
          {networkItem?.url?.includes('//')
            ? networkItem?.url?.split('//')[1]
            : networkItem?.url || isDisabled}
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
                onClick={() => dispatch(removeCustomNetwork(networkItem))}
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
          <NetworkItem
            isActive={isActive}
            networkItem={network}
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
