import React from 'react';

import { Box, BoxProps, color, Flex, FlexProps, Stack } from '@stacks/ui';
import { IconCheck } from '@tabler/icons';

import { useNetwork } from '@common/hooks/use-network';
import { Caption, Title } from '@components/typography';
import { border } from '@common/utils';
import { useModal } from '@common/hooks/use-modal';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetchFromApi } from '@common/api/fetch';

import { TESTNET_CHAIN_ID } from '@common/constants';
import { Badge } from '@components/badge';

interface ItemWrapperProps extends FlexProps {
  isDisabled?: boolean;
  isActive?: boolean;
}
const ItemWrapper: React.FC<ItemWrapperProps> = ({ isActive, isDisabled, ...props }) => {
  return (
    <Flex
      opacity={isDisabled ? 0.5 : 1}
      alignItems="center"
      justifyContent="space-between"
      px="extra-loose"
      py="base"
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
  item: { label: string; url: string };
}
const Item: React.FC<ItemProps> = ({ item, isActive, isDisabled, ...rest }) => {
  const { data, error } = useSWR(isDisabled ? null : item.url, async () => {
    const response = await fetchFromApi(item.url)('/v2/info');
    return response.json();
  });
  const networkId = data?.network_id && parseInt(data?.network_id);

  const networkMode = networkId
    ? TESTNET_CHAIN_ID === networkId
      ? 'Testnet'
      : 'Mainnet'
    : undefined;

  return (
    <ItemWrapper isActive={isActive} isDisabled={isDisabled || !!error?.message} {...rest}>
      <Stack flexGrow={1} spacing="tight">
        <Flex alignItems="center">
          <Title display="block">{item.label}</Title>
          {networkMode ? (
            <Badge bg={color('bg-4')} ml="tight" border={border()} color={color('text-caption')}>
              {networkMode}
            </Badge>
          ) : null}
        </Flex>
        <Caption display="block">
          {item.url.includes('//') ? item.url.split('//')[1] : item.url}
        </Caption>
      </Stack>
      {isActive ? <Box as={IconCheck} color={color('feedback-success')} size="18px" /> : null}
      {!!error?.message ? <Caption color={color('feedback-error')}>Offline</Caption> : null}
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
      borderTop={border()}
      {...rest}
    >
      <Title fontWeight={400}>Add a network</Title>
    </ItemWrapper>
  );
};
interface NetworkItemsProps extends BoxProps {
  itemOnClick?: (item?: any) => void;
}
export const NetworkItems: React.FC<NetworkItemsProps> = React.memo(({ itemOnClick }) => {
  const { list, index, handleUpdateCurrentIndex } = useNetwork();
  const router = useRouter();

  return list && list?.length ? (
    <>
      <Item
        isDisabled
        item={{
          label: 'stacks.co',
          url: 'mainnet.stacks.co',
        }}
      />
      {list?.map((item, key) => {
        const isActive = key === index;
        return (
          <Item
            isActive={isActive}
            item={item}
            key={key}
            onClick={() => {
              itemOnClick?.(item);
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
          itemOnClick?.();
        }}
      />
    </>
  ) : null;
});
