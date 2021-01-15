import React from 'react';

import { Box, BoxProps, color, Flex, FlexProps, IconButton, Stack, Tooltip } from '@stacks/ui';
import { IconCheck, IconTrash } from '@tabler/icons';

import { useNetwork } from '@common/hooks/use-network';
import { Caption, Title } from '@components/typography';
import { border, isLocal } from '@common/utils';
import { useModal } from '@common/hooks/use-modal';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetchFromApi } from '@common/api/fetch';

import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '@common/constants';
import { Badge } from '@components/badge';

import { useSetChainMode } from '@common/hooks/use-chain-mode';
import { getChainTypeFromId, getDefaultChainId } from '@common/api/utils';

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
  item: { label: string; url?: string };
  isCustom?: boolean;
}

const Item: React.FC<ItemProps> = ({ item, isActive, isDisabled, onClick, isCustom, ...rest }) => {
  const { handleRemoveNetwork } = useNetwork();
  const setChainMode = useSetChainMode();

  const isDefault = item.url === DEFAULT_TESTNET_SERVER || item.url === DEFAULT_MAINNET_SERVER;
  const doNotFetch = isDisabled || !item.url || isDefault;

  const { data, error } = useSWR(!!doNotFetch ? null : (item?.url as string), async () => {
    const response = await fetchFromApi(item.url as string)('/v2/info');
    return response.json();
  });

  const networkId =
    isDefault && item.url
      ? getDefaultChainId(item.url)
      : data?.network_id && parseInt(data?.network_id);

  const networkMode = getChainTypeFromId(networkId);

  const handleClick = React.useCallback(
    async e => {
      await setChainMode(networkMode);
      onClick?.(e);
    },
    [networkMode]
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
          {networkMode ? (
            <Badge bg={color('bg-4')} ml="tight" border={border()} color={color('text-caption')}>
              {networkMode}
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
                onClick={() =>
                  item.url && handleRemoveNetwork(item as { label: string; url: string })
                }
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
  const { handleOpenNetworkModal } = useModal();

  return (
    <ItemWrapper
      onClick={e => {
        handleOpenNetworkModal();
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
  const { networkList, currentNetworkIndex, handleUpdateCurrentIndex } = useNetwork();
  const router = useRouter();

  return (
    <>
      {networkList?.map((item, key) => {
        const isActive = key === currentNetworkIndex;
        if (!isLocal() && item?.url?.includes('localhost')) return null;
        return (
          <Item
            isActive={isActive}
            item={item}
            key={key}
            isCustom={key >= 3}
            onClick={() => {
              onItemClick?.(item);
              if (!isActive) {
                handleUpdateCurrentIndex(key);
                router.reload();
              }
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
