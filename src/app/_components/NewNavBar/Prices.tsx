import { useGlobalContext } from '@/common/context/useGlobalContext';
import { usdFormatter } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import BitcoinIcon from '@/ui/icons/BitcoinIcon';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Flex, Icon } from '@chakra-ui/react';

export const Prices = () => {
  const { tokenPrice } = useGlobalContext();
  const formattedBtcPrice = tokenPrice.btcPrice ? usdFormatter.format(tokenPrice.btcPrice) : '';
  const formattedStxPrice = tokenPrice.stxPrice ? usdFormatter.format(tokenPrice.stxPrice) : '';
  return (
    <Flex gap={1.5} alignItems="center">
      <Flex
        gap={1}
        alignItems="center"
        px={{ base: 2, lg: 2 }}
        py={{ base: 2, lg: 1.5 }}
        borderRadius="redesign.sm"
        bg="surfacePrimary"
      >
        <Icon h={3} w={3} color="iconPrimary">
          <StacksIconThin />
        </Icon>
        <Text
          textStyle={{ base: 'text-regular-sm', lg: 'text-regular-xs' }}
          color="textPrimary"
          fontStyle="var(--font-matter-mono)"
        >
          {!formattedStxPrice ? 'N/A' : formattedStxPrice}
        </Text>
      </Flex>
      <Flex
        gap={1}
        alignItems="center"
        px={{ base: 2, lg: 2 }}
        py={{ base: 2, lg: 1.5 }}
        borderRadius="redesign.sm"
        bg="surfacePrimary"
      >
        <Icon h={3.5} w={3.5} color="accent.bitcoin-600">
          <BitcoinIcon />
        </Icon>
        <Text
          textStyle={{ base: 'text-regular-sm', lg: 'text-regular-xs' }}
          color="textPrimary"
          fontStyle="var(--font-matter-mono)"
        >
          {!formattedBtcPrice ? 'N/A' : formattedBtcPrice}
        </Text>
      </Flex>
    </Flex>
  );
};
