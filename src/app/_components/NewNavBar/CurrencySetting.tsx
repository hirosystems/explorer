'use client';

import { useAppDispatch } from '@/common/state/hooks';
import { Currency, setCurrency, useCurrency } from '@/common/state/slices/currency-slice';
import { Text } from '@/ui/Text';
import { Box, Flex } from '@chakra-ui/react';

import { OptionPicker } from './OptionPicker';

export const CurrencySetting = () => {
  const dispatch = useAppDispatch();
  const selectedCurrency = useCurrency();
  return (
    <Flex alignItems="center" justifyContent="space-between" gap={8}>
      <Box lineHeight="redesign.short">
        <Text color="textPrimary" fontSize={{ base: 'sm', lg: 'xs' }} fontWeight="medium">
          Currency
        </Text>
        <Text color="textSecondary" fontSize={{ base: 'sm', lg: 'xs' }}>
          {selectedCurrency.toUpperCase()}
        </Text>
      </Box>
      <OptionPicker
        options={Object.values(Currency).map(currency => ({
          id: currency,
          label: currency.toUpperCase(),
          value: currency,
          icon: props => (
            <Text
              fontSize={{ base: 'sm', lg: 'xs' }}
              fontFamily="var(--font-matter-mono)"
              {...props}
            >
              {currency === Currency.USD
                ? '$'
                : currency === Currency.EUR
                  ? '€'
                  : currency === Currency.GBP
                    ? '£'
                    : currency === Currency.BTC
                      ? '₿'
                      : null}
            </Text>
          ),
          onSelect: () => dispatch(setCurrency(currency)),
        }))}
        defaultOptionId={selectedCurrency}
        iconButtonHeight={{ base: 8, lg: 6 }}
        iconButtonWidth={{ base: 12, lg: 8 }}
      />
    </Flex>
  );
};
