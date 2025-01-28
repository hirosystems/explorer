import { DEFAULT_DEVNET_SERVER } from '@/common/constants/constants';
import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '@/common/constants/env';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { useCustomNetworkApiInfo } from '@/common/queries/useCustomNetworkApiInfo';
import { useAppDispatch } from '@/common/state/hooks';
import { setActiveNetwork } from '@/common/state/slices/network.slice';
import { Network } from '@/common/types/network';
import { buildUrl } from '@/common/utils/buildUrl';
import { Button } from '@/components/ui/button';
import { Link } from '@/ui/Link';
import { Text } from '@/ui/Text';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { Check, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';

const NetworkLabel = ({
  network,
  isActiveNetwork,
  key,
}: {
  network: Network;
  isActiveNetwork: boolean;
  key: string;
}) => {
  const dispatch = useAppDispatch();
  const isMainnet = network.url === DEFAULT_MAINNET_SERVER;
  const isTestnet = network.url === DEFAULT_TESTNET_SERVER;
  const isDefault = isMainnet || isTestnet;
  const isDevnet = network.url === DEFAULT_DEVNET_SERVER;

  const { error, isFetching } = useCustomNetworkApiInfo(network.url, {
    enabled: !!network.url && !isDefault,
  });
  const isDisabled = isFetching || !!error;

  const isNetworkRemovable = useMemo(
    () => network.isCustomNetwork && !isDevnet && !isActiveNetwork,
    [network.isCustomNetwork, isDevnet, isActiveNetwork]
  );

  const onClick = () => {
    if (isActiveNetwork) {
      return;
    }
    dispatch(setActiveNetwork(network));
    window.location.href = 'https://your-site.com/path?param=value';
  };

  return (
    <Link
      href={isActiveNetwork || isDisabled ? undefined : buildUrl('/', network)}
      onClick={onClick}
      variant="noUnderline"
      w="full"
      pointerEvents={isActiveNetwork || isDisabled ? 'none' : 'auto'}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="full"
        key={key}
        border={isActiveNetwork ? '1px solid' : 'none'}
        borderColor="newBorderSecondary"
        borderRadius="md"
        px={3}
        py={2}
        _hover={{
          bg: isActiveNetwork ? 'transparent' : 'surfaceTertiary',
        }}
      >
        <Stack>
          <Text fontSize="xs" fontWeight="medium" color="textPrimary">
            {network.label}
          </Text>
          <Text fontSize="xs" color="textSecondary">
            {network.url}
          </Text>
        </Stack>
        {isActiveNetwork ? (
          <Flex
            bg="surfaceInvert"
            px={2}
            py={1}
            h={6}
            w={8}
            borderRadius="md"
            alignItems="center"
            justifyContent="center"
          >
            <Icon h={4} w={4} color="iconInvert">
              <Check />
            </Icon>
          </Flex>
        ) : isNetworkRemovable ? (
          <Icon h={4} w={4} color="iconPrimary">
            <Trash />
          </Icon>
        ) : isDisabled ? (
          <Text fontSize="xs" color="textTertiary">
            Offline
          </Text>
        ) : null}
      </Flex>
    </Link>
  );
};

export const NetworkSetting = () => {
  // const networks = useNetworks();
  // const activeNetwork = useActiveNetwork();

  const { networks, activeNetworkKey } = useGlobalContext();
  return (
    <Stack gap={4}>
      <Stack gap={1.5} w="full">
        {Object.entries(networks).map(([url, network]) => (
          <NetworkLabel
            key={network.url}
            network={network}
            isActiveNetwork={network.url === activeNetworkKey}
          />
        ))}
      </Stack>
      <Button
        size="xs"
        color="var(--stacks-colors-neutral-sand-50)"
        bg="var(--stacks-colors-neutral-sand-700)"
        px={3}
        py={2}
        borderRadius="md"
        fontWeight="medium"
        w="fit-content"
      >
        Add a network
      </Button>
    </Stack>
  );
};
