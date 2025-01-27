'use client';

import { useAppDispatch, useAppSelector } from '@/common/state/hooks';
import { Currency, setCurrency } from '@/common/state/slices/currency.slice';
import { Text } from '@/ui/Text';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { CurrencyBtc, CurrencyDollarSimple, CurrencyEur, CurrencyGbp } from '@phosphor-icons/react';

function getCurrencyIcon(currency: Currency) {
  return currency === Currency.USD ? (
    <CurrencyDollarSimple />
  ) : currency === Currency.EUR ? (
    <CurrencyEur />
  ) : currency === Currency.GBP ? (
    <CurrencyGbp />
  ) : currency === Currency.BTC ? (
    <CurrencyBtc />
  ) : null;
}

export const CurrencySetting = () => {
  const dispatch = useAppDispatch();
  const selectedCurrency = useAppSelector(state => state.currency.currency);
  return (
    <Flex justifyContent="space-between">
      <Box>
        <Text color="textPrimary" fontSize="xs">
          Currency
        </Text>
        <Text color="textSecondary" fontSize="xs">
          {selectedCurrency.toUpperCase()}
        </Text>
      </Box>
      <Flex
        border="1px solid"
        borderColor="newBorderSecondary"
        borderRadius="lg"
        p={1}
        gap={1}
        alignItems="center"
      >
        {Object.values(Currency).map(currency => (
          <IconButton
            aria-label="Change currency"
            onClick={() => dispatch(setCurrency(currency))}
            borderRadius="md"
            h={6}
            w={8}
            py={1}
            px={2}
            bg={currency === selectedCurrency ? 'surfaceInvert' : 'surfacePrimary'}
            color={currency === selectedCurrency ? 'iconInvert' : 'iconSecondary'}
          >
            {getCurrencyIcon(currency)}
          </IconButton>
        ))}
      </Flex>
    </Flex>
  );
};
