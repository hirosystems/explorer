import React from 'react';
import Link from 'next/link';
import { Box, Text } from '@blockstack/ui';
import { fetchTxList } from '@common/api/transactions';
import Router from 'next/router';

export const DevLinks = () => (
  <Box position="absolute" bottom="base" right="base">
    <Text
      cursor="pointer"
      mr="base"
      onClick={async () => {
        const { results } = await fetchTxList();
        console.log(results);
        const randomTx = results[Math.floor(Math.random() * results.length)];
        await Router.push(`/txid/${randomTx.tx_id}`);
      }}
    >
      <a>Random tx</a>
    </Text>
    <Link href="/components">
      <a>Components</a>
    </Link>
  </Box>
);
