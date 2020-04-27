import * as React from 'react';
import { Text, Box, Stack, Button } from '@blockstack/ui';
import { Input, FormLabel } from '@components/debug/common';
import { Title } from '@components/typography';

import { handleDebugFormSubmit, Key } from '@common/debug';
import { useFormik } from 'formik';
import Link from 'next/link';

export const TokenTransfer = (props: any) => {
  const path = '/debug/broadcast/token-transfer';
  const [txid, setTxid] = React.useState('');
  const formik = useFormik({
    initialValues: {
      origin_key: '',
      recipient_address: '',
      stx_amount: 100,
      fee_rate: 123456,
      memo: 'hello world!',
    },
    onSubmit: async values => {
      const text = await handleDebugFormSubmit(values, path);
      const regex = /0x[A-Fa-f0-9]{64}/;
      // @ts-ignore
      const txid = regex.exec(text);
      if (txid && txid.length) {
        setTxid(txid[0]);
      }
    },
  });

  return (
    <Box
      as="form"
      //@ts-ignore
      onSubmit={formik.handleSubmit}
      action=""
      method="post"
    >
      <Stack spacing="base">
        <Title as="h2">Token Transfer</Title>
        <Box>
          <FormLabel htmlFor="origin_key">Sender key</FormLabel>
          <Input
            name="origin_key"
            placeholder="Secret key hash"
            onChange={formik.handleChange}
            value={formik.values.origin_key}
            isRequired
          />
        </Box>

        <Box>
          <FormLabel htmlFor="recipient_address">Recipient address</FormLabel>
          <Input
            list="recipient_addresses"
            name="recipient_address"
            placeholder="Stacks address"
            onChange={formik.handleChange}
            value={formik.values.recipient_address}
            isRequired
          />
        </Box>

        <Box>
          <FormLabel htmlFor="stx_amount">uSTX amount</FormLabel>
          <Input
            type="number"
            id="stx_amount"
            name="stx_amount"
            onChange={formik.handleChange}
            value={formik.values.stx_amount}
          />
        </Box>

        <Box>
          <FormLabel htmlFor="fee_rate">uSTX tx fee</FormLabel>
          <Input
            type="number"
            id="fee_rate"
            name="fee_rate"
            onChange={formik.handleChange}
            value={formik.values.fee_rate}
          />
        </Box>

        <Box>
          <FormLabel htmlFor="memo">Memo</FormLabel>
          <Input
            type="text"
            id="memo"
            name="memo"
            onChange={formik.handleChange}
            value={formik.values.memo}
            maxLength={34}
          />
        </Box>
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
        {txid !== '' ? (
          <Box pt="extra-loose">
            <Box mb="base-tight">
              <Text as="h3" fontWeight="bold">
                Transaction
              </Text>
            </Box>
            <Box>
              <Link href="/txid/[txid]" as={`/txid/${txid}`} passHref>
                <a href={`/txid/${txid}`} target="_blank">
                  {txid}
                </a>
              </Link>
            </Box>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
};
