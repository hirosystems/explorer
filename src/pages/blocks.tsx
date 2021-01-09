import * as React from 'react';
import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { NextPage, NextPageContext } from 'next';
import { fetchBlocksList, FetchBlocksListResponse } from '@common/api/blocks';
import { BlocksList } from '@components/blocks-list';
import { useInfiniteFetch } from '@common/hooks/use-fetch-blocks';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { getServerSideApiServer } from '@common/api/utils';

const BlocksPage: NextPage<{ blocks: FetchBlocksListResponse }> = ({ blocks: initialBlocks }) => {
  const { data: blocks, loadMore, isLoadingMore } = useInfiniteFetch<Block>({
    initialData: initialBlocks.results,
    type: 'block',
    limit: 30,
  });

  return (
    <>
      <Meta title="Recent transactions" />
      <Box mb="base-loose">
        <Title mt="72px" color="white" as="h1" fontSize="36px">
          Blocks
        </Title>
      </Box>
      <BlocksList blocks={blocks} loadMore={loadMore} isLoadingMore={isLoadingMore} />
    </>
  );
};

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{ props: { blocks: FetchBlocksListResponse } }> {
  const apiServer = await getServerSideApiServer(ctx);
  const blocks = await fetchBlocksList({
    apiServer,
    limit: 30,
  })();
  return {
    props: {
      blocks,
    },
  };
}

export default BlocksPage;
