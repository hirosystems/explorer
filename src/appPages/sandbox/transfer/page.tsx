import { useColorMode } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import { Form, Formik } from 'formik';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { openSTXTransfer } from '@stacks/connect';
import { useApi } from '@/common/api/client';
import { Badge } from '@/common/components/Badge';
import { CONNECT_AUTH_ORIGIN } from '@/common/constants';
import { microToStacks, stacksToMicro, validateStacksAddress } from '@/common/utils';
import { Input } from '@/ui/Input';
import { Box, Button, Flex, Grid, Spinner, Stack } from '@/ui/components';
import { Caption, Text, Title } from '@/ui/typography';

import { useStacksNetwork } from '../../common/hooks/use-stacks-network';
import { useUser } from '../hooks/useUser';

function Page() {
  const { feesApi } = useApi();
  const { data: feeData } = useQuery(['transfer-fees'], () => feesApi.getFeeTransfer());
  const network = useStacksNetwork();
  const { isConnected, balance, stxAddress, isFetching } = useUser();
  const fee = feeData ? new BigNumber(feeData as any).multipliedBy(180) : 0;
  const { colorMode } = useColorMode();

  if (isFetching) return <Spinner alignSelf={'center'} justifySelf={'center'} size={'32px'} />;

  return (
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
    >
      {({ handleChange, handleBlur, values, errors, setFieldValue }) => (
        <Grid minHeight="600px" gridTemplateColumns="760px" flexGrow={1} flexShrink={1}>
          <Flex flexGrow={1} flexDirection="column" p="24px">
            <Form>
              <Stack spacing="16px">
                <Title fontSize="24px">Send STX</Title>
                <Text color="textBody" maxWidth="42ch" lineHeight="1.6" display="block">
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
                          const total = BigInt(balance?.stx?.balance || 0) - BigInt(fee.toString());
                          void setFieldValue('amount', microToStacks(total.toString(), false));
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
                      bg="bg"
                      position="absolute"
                      right="1px"
                      top="1px"
                      borderLeftWidth="1px"
                      placeItems="center"
                      borderRadius="0 4px 4px 0"
                      height="100%"
                      px="16px"
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
    </Formik>
  );
}

export default Page;
