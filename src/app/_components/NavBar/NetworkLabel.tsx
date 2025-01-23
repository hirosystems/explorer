import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '@/common/constants/env';
import { Badge, Flex, Icon, Spinner, Stack } from '@chakra-ui/react';
import { Check, Trash } from '@phosphor-icons/react';
import { FC, useMemo } from 'react';

import { DEFAULT_DEVNET_SERVER } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { useCustomNetworkApiInfo } from '../../../common/queries/useCustomNetworkApiInfo';
import { Network } from '../../../common/types/network';
import { buildUrl } from '../../../common/utils/buildUrl';
import { IconButton } from '../../../ui/IconButton';
import { Tooltip } from '../../../ui/Tooltip';
import { Caption, Title } from '../../../ui/typography';

const ellipsisStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const NetworkLabel: FC<{ network: Network }> = ({ network }) => {
  const { activeNetwork, removeCustomNetwork } = useGlobalContext();
  const isMainnet = network.url === DEFAULT_MAINNET_SERVER;
  const isTestnet = network.url === DEFAULT_TESTNET_SERVER;
  const isDevnet = network.url === DEFAULT_DEVNET_SERVER;
  const isDefault = isMainnet || isTestnet;

  const { error, isFetching } = useCustomNetworkApiInfo(network.url, {
    enabled: !!network.url && !isDefault,
  });

  const isDisabled = isFetching || !!error;
  const isActive = activeNetwork.url === network.url;
  const networkHref = buildUrl('/', network);

  const isNetworkRemovable = useMemo(
    () =>
      network.isCustomNetwork &&
      !isDevnet &&
      !isActive &&
      !network.label.includes('Nakamoto') &&
      network.label !== 'https://api.nakamoto.testnet.hiro.so',
    [network.isCustomNetwork, isDevnet, isActive, network.label]
  );

  return (
    <Flex
      justifyContent="space-between"
      width="full"
      maxWidth="full"
      py={3}
      px={{ base: 0, lg: 3 }}
      opacity={isDisabled ? 0.5 : 1}
      cursor={isDisabled ? 'not-allowed' : 'unset'}
      gap={2}
    >
      <Stack
        as={isDisabled || isActive ? 'div' : 'a'}
        {...(!!networkHref && (!isDisabled || isActive) ? { href: networkHref } : {})}
        flexGrow={1}
        cursor={isDisabled ? 'not-allowed' : isActive ? 'unset' : 'pointer'}
        minWidth={0}
      >
        <Flex alignItems="center" width="full">
          <Title
            display="block"
            fontSize={'sm'}
            fontWeight="normal"
            style={ellipsisStyle}
            title={network.label}
            maxWidth="100%"
          >
            {network.label}
          </Title>
          {network.isSubnet && (
            <Badge
              bg={'navbar.networkLabelBadgeBackground'}
              ml={2}
              color={'navbar.networkLabelBadge'}
            >
              subnet
            </Badge>
          )}
        </Flex>
        <Caption
          display="block"
          color="textSubdued"
          fontWeight="regular"
          fontSize="sm"
          style={ellipsisStyle}
          title={network?.url?.includes('//') ? network?.url?.split('//')[1] : network?.url}
          textAlign="left"
          maxWidth="100%"
        >
          {network?.url?.includes('//') ? network?.url?.split('//')[1] : network?.url}
        </Caption>
      </Stack>
      <Flex alignItems="center" position={'relative'}>
        {isFetching ? (
          <Spinner h={4} w={4} opacity={0.5} color={'#666'} data-testid="spinner" />
        ) : !!error ? (
          <Caption color={`error`}>Offline</Caption>
        ) : isNetworkRemovable ? (
          <Tooltip content="Remove network">
            <IconButton
              disabled={isDisabled}
              position="relative"
              color={'surfaceOpposite'}
              size={5}
              onClick={() => removeCustomNetwork(network)}
              aria-label={'Remove network'}
              _hover={{ bg: 'whiteAlpha.400' }}
            >
              <Icon h={4} w={4}>
                <Trash />
              </Icon>
            </IconButton>
          </Tooltip>
        ) : isActive ? (
          <Icon color={'icon'} h={4} w={4}>
            <Check />
          </Icon>
        ) : null}
      </Flex>
    </Flex>
  );
};
