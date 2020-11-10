// @ts-nocheck
import React from 'react';
import { Box, color, Flex, Grid, Stack } from '@stacks/ui';
import { Input } from '@components/sandbox/common';
import { useFormik } from 'formik';
import { Button } from '@components/button';
import { Caption, Text, Title } from '@components/typography';
import { openSTXTransfer } from '@stacks/connect';
import { border, microToStacks, stacksToMicro, validateStacksAddress } from '@common/utils';
import { useUser } from '@common/hooks/use-user';
import { Error } from '@components/sandbox/error';
import { Badge } from '@components/badge';
import useSWR from 'swr';
import { useApiServer } from '@common/hooks/use-api';
import { BigNumber } from 'bignumber.js';

const fetcher = async (apiServer: string) => {
  const res = await fetch(apiServer + '/v2/fees/transfer');
  const data = await res.json();
  return data;
};

export const TokenTransferView = () => {
  const apiServer = useApiServer();

  const { data } = useSWR(apiServer, fetcher);

  const fee = data ? new BigNumber(data).multipliedBy(180) : 0;

  const { principal, balances } = useUser();
  const { handleSubmit, handleChange, handleBlur, values, errors, setFieldValue } = useFormik({
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      recipient: '',
      memo: '',
      amount: null,
    },
    onSubmit: ({ recipient, amount, memo }) => {
      void openSTXTransfer({ recipient, amount: stacksToMicro(amount), memo });
    },
    validate: values => {
      const _errors = {};
      const validPrincipal = validateStacksAddress(values.recipient);
      if (!validPrincipal) {
        _errors.recipient = 'Invalid Stacks address.';
      } else if (values.recipient === principal) {
        _errors.recipient = 'You cannot send yourself STX ;)';
      }

      if (!values.amount) {
        _errors.amount = 'You need to specify an amount to send.';
      }
      if (balances?.stx.balance < values.amount) {
        _errors.amount = "Sorry, you don't have enough STX to make this transfer.";
      }
      return _errors;
    },
  });

  const handleSetMax = () => {
    const total = balances?.stx?.balance - fee.toString();
    console.log(total, fee.toString());
    setFieldValue('amount', microToStacks(total, false));
  };
  return (
    <Flex flexDirection="column" p="extra-loose">
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing="base">
          <Title fontSize="24px">Send STX</Title>
          <Text color={color('text-body')} maxWidth="42ch" lineHeight="1.6" display="block">
            Enter a STX address and an amount you'd like to send.
          </Text>
          {Object.keys(errors)?.length ? (
            <Error>{errors?.recipient || errors?.amount}</Error>
          ) : null}
          <Input
            id="recipient"
            name="recipient"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.recipient}
            placeholder="Recipient STX address"
          />
          <Box>
            <Flex alignItems="center" position="relative">
              {balances?.stx?.balance ? (
                <Badge
                  border={border()}
                  color={color('text-caption')}
                  position="absolute"
                  zIndex={999}
                  right="68px"
                  onClick={handleSetMax}
                  _hover={{
                    bg: color('bg-alt'),
                    cursor: 'pointer',
                    color: color('text-title'),
                  }}
                >
                  Send max
                </Badge>
              ) : null}
              <Input
                id="amount"
                name="amount"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.amount}
                placeholder="0.000000"
                flexGrow={1}
              />
              <Grid
                bg={color('bg')}
                position="absolute"
                right="1px"
                top="1px"
                height="46px"
                p="base"
                borderLeft={border()}
                placeItems="center"
                borderRadius="0 4px 4px 0"
              >
                <Caption>STX</Caption>
              </Grid>
            </Flex>
          </Box>
          <Input
            id="memo"
            name="memo"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.memo}
            placeholder="Optional message (memo)"
          />
          <Box>
            <Button type="submit">Send STX</Button>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};
