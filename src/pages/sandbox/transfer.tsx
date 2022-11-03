import React from 'react';
import type { NextPage } from 'next';
import { Box, color, Flex, Grid, Stack } from '@stacks/ui';
import { border, microToStacks, stacksToMicro, validateStacksAddress } from '@common/utils';
import { Button } from '@components/button';
import { Caption, Text, Title } from '@components/typography';
import { Badge } from '@components/badge';
import { useUser } from '@modules/sandbox/hooks/useUser';
import { Layout } from '@modules/sandbox/components/Layout';
import { Input } from '@components/inputs';
import { useNetworkConfig } from '@common/hooks/use-network-config';
import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import { useApi } from '@common/api/client';
import { useQuery } from 'react-query';
import { openSTXTransfer } from '@stacks/connect';
import { CONNECT_AUTH_ORIGIN } from '@common/constants';

const Transfer: NextPage = () => {
  const { feesApi } = useApi();
  const { data: feeData } = useQuery('transfer-fees', () => feesApi.getFeeTransfer());
  const network = useNetworkConfig();
  const { isConnected, balance, stxAddress } = useUser();
  const fee = feeData ? new BigNumber(feeData as any).multipliedBy(180) : 0;
  const { handleSubmit, handleChange, handleBlur, values, errors, setFieldValue } = useFormik({
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      recipient: '',
      memo: '',
      amount: null,
    },
    onSubmit: ({ recipient, amount, memo }) => {
      void openSTXTransfer({
        network,
        recipient,
        amount: stacksToMicro(amount || 0).toString(),
        memo,
        authOrigin: CONNECT_AUTH_ORIGIN,
      });
    },
    validate: values => {
      const _errors: any = {};
      const validPrincipal = validateStacksAddress(values.recipient);
      if (!validPrincipal) {
        _errors.recipient = 'Invalid Stacks address.';
      } else if (values.recipient === stxAddress) {
        _errors.recipient = 'You cannot send yourself STX ;)';
      }

      if (!values.amount) {
        _errors.amount = 'You need to specify an amount to send.';
      }
      if ((balance?.stx?.balance || 0) < (values.amount || 0)) {
        _errors.amount = "Sorry, you don't have enough STX to make this transfer.";
      }
      return _errors;
    },
  });

  const handleSetMax = () => {
    const total = BigInt(balance?.stx?.balance || 0) - BigInt(fee.toString());
    void setFieldValue('amount', microToStacks(total.toString(), false));
  };
  return (
    <Layout>
      <Grid minHeight="600px" gridTemplateColumns="760px" flexGrow={1} flexShrink={1}>
        <Flex flexGrow={1} flexDirection="column" p="loose">
          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing="base">
              <Title fontSize="24px">Send STX</Title>
              <Text color={color('text-body')} maxWidth="42ch" lineHeight="1.6" display="block">
                Enter a STX address and an amount you'd like to send.
              </Text>
              {Object.keys(errors)?.length ? (
                <Box
                  borderRadius="6px"
                  bg="rgba(207,0,0,0.05)"
                  border="1px solid rgba(207,0,0,0.1)"
                  px="base"
                  py="tight"
                  color="red"
                  lineHeight="1.8"
                  fontSize="14px"
                  wordBreak="break-all"
                >
                  {errors?.recipient || errors?.amount}
                </Box>
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
                  {balance?.stx?.balance ? (
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
                    value={values.amount || 0}
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
                <Button type="submit">{isConnected ? 'Send STX' : 'Connect Stacks Wallet'}</Button>
              </Box>
            </Stack>
          </Box>
        </Flex>
      </Grid>
    </Layout>
  );
};

export default Transfer;
