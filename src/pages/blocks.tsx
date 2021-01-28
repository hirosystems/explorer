import * as React from 'react';
import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { NextPage, NextPageContext } from 'next';
import { BlocksList } from '@components/blocks-list';
import { getSsrBlocksProps } from '@common/lib/pages/blocks';
import { BLOCKS_PAGE_BLOCKS_LIST, BLOCKS_PAGE_BLOCKS_LIST_LIMIT } from '@common/constants/data';

const BlocksPage: NextPage = () => (
  <>
    <Meta title="Recent transactions" />
    <Box mb="base-loose">
      <Title mt="72px" color="white" as="h1" fontSize="36px">
        Blocks
      </Title>
    </Box>
    <BlocksList
      infinite
      key={BLOCKS_PAGE_BLOCKS_LIST}
      fetchKey={BLOCKS_PAGE_BLOCKS_LIST}
      limit={BLOCKS_PAGE_BLOCKS_LIST_LIMIT}
    />
  </>
);

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{ props: { dehydratedState: string } }> {
  return {
    props: {
      dehydratedState: await getSsrBlocksProps(ctx),
    },
  };
}

export default BlocksPage;
