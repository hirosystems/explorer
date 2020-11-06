// @ts-nocheck
import React from 'react';
import { Box, color, Flex, Grid, Stack } from '@stacks/ui';
import { Input } from '@components/sandbox/common';
import { useFormik } from 'formik';
import { Button } from '@components/button';
import { Caption, Text } from '@components/typography';
import { openSTXTransfer } from '@stacks/connect';
import { border } from '@common/utils';

export const TokenTransferView = () => {
  const { handleSubmit, handleChange, handleBlur, values } = useFormik({
    initialValues: {
      recipient: '',
      memo: '',
      amount: null,
    },
    onSubmit: ({ recipient, amount, memo }) => {
      void openSTXTransfer({ recipient, amount, memo });
    },
  });
  return (
    <Flex flexDirection="column" p="extra-loose">
      <Box mb="base-loose">
        <Text color={color('text-body')} maxWidth="38ch" lineHeight="1.6" display="block">
          Enter a STX address and an amount in µSTX you'd like to send.
        </Text>
      </Box>
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing="base">
          <Input
            id="recipient"
            name="recipient"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.recipient}
            placeholder="Recipient STX address"
          />
          <Flex position="relative">
            <Input
              id="amount"
              name="amount"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.amount}
              placeholder="µSTX amount"
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
              <Caption>µSTX</Caption>
            </Grid>
          </Flex>
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
