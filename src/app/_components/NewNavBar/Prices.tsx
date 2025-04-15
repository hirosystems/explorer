import { TokenPrice } from '@/common/types/tokenPrice';
import { usdFormatter } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import BitcoinIcon from '@/ui/icons/BitcoinIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { Flex, Icon } from '@chakra-ui/react';

export const Prices = ({ tokenPrices }: { tokenPrices: TokenPrice }) => {
  const formattedBtcPrice = tokenPrices.btcPrice ? usdFormatter.format(tokenPrices.btcPrice) : '';
  const formattedStxPrice = tokenPrices.stxPrice ? usdFormatter.format(tokenPrices.stxPrice) : '';
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
          <StxIcon />
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
        <Icon h={3} w={3} color="accent.bitcoin-600">
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
