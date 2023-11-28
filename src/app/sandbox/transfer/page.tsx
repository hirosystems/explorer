'use client';

import { useColorMode } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';

import { openSTXTransfer } from '@stacks/connect';

import { Badge } from '../../../common/components/Badge';
import { CONNECT_AUTH_ORIGIN } from '../../../common/constants/env';
import { useStacksNetwork } from '../../../common/hooks/useStacksNetwork';
import { useFeeTransfer } from '../../../common/queries/useFeeTransfer';
import { microToStacks, stacksToMicro, validateStacksAddress } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { Input } from '../../../ui/Input';
import { Stack } from '../../../ui/Stack';
import { Caption, Text, Title } from '../../../ui/typography';
import { Wrapper } from '../Wrapper';
import { useUser } from '../hooks/useUser';

const Page: NextPage = () => {
  const { data: feeData } = useFeeTransfer();
  const network = useStacksNetwork();
  const { isConnected, balance, stxAddress } = useUser();
  const fee = feeData ? new BigNumber(feeData as any).multipliedBy(180) : 0;
  const colorMode = useColorMode().colorMode;

  return (
    <Wrapper>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          recipient: '',
          memo: '',
          amount: null,
        }}
        validate={values => {
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
          if (Number(balance?.stx?.balance || '0') < (values.amount || 0)) {
            _errors.amount = "Sorry, you don't have enough STX to make this transfer.";
          }
          return _errors;
        }}
        onSubmit={({ recipient, amount, memo }) => {
          void openSTXTransfer({
            network,
            recipient,
            amount: stacksToMicro(amount || 0).toString(),
            memo,
            authOrigin: CONNECT_AUTH_ORIGIN,
          });
        }}
        render={({ handleChange, handleBlur, values, errors, setFieldValue }) => (
          <Grid minHeight="600px" gridTemplateColumns="760px" flexGrow={1} flexShrink={1}>
            <Flex flexGrow={1} flexDirection="column" p="24px">
              <Form>
                <Stack spacing="16px">
                  <Title fontSize="24px">Send STX</Title>
                  <Text color={'textBody'} maxWidth="42ch" lineHeight="1.6" display="block">
                    Enter a STX address and an amount you'd like to send.
                  </Text>
                  {Object.keys(errors)?.length ? (
                    <Box
                      px="16px"
                      py="8px"
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
                          color={`textCaption.${colorMode}`}
                          position="absolute"
                          right="68px"
                          onClick={() => {
                            const total =
                              BigInt(balance?.stx?.balance || 0) - BigInt(fee.toString());
                            void setFieldValue('amount', microToStacks(total.toString()));
                          }}
                          _hover={{
                            bg: 'bgAlt',
                            cursor: 'pointer',
                            color: 'textTitle',
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
                        bg={'bg'}
                        position="absolute"
                        right="1px"
                        top="1px"
                        borderLeftWidth={'1px'}
                        placeItems="center"
                        borderRadius="0 4px 4px 0"
                        height={'100%'}
                        px={'16px'}
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
                    <Button type="submit">
                      {isConnected ? 'Send STX' : 'Connect Stacks Wallet'}
                    </Button>
                  </Box>
                </Stack>
              </Form>
            </Flex>
          </Grid>
        )}
      />
    </Wrapper>
  );
};

export default Page;
