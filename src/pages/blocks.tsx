import * as React from 'react';
import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { BlocksList } from '@features/blocks-list';

import type { NextPage } from 'next';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

const BlocksPage: NextPage = () => (
  <>
    <Meta title="Recent Blocks" />
    <Box mb="base-loose">
      <Title mt="72px" color="white" as="h1" fontSize="36px">
        Blocks
      </Title>
      <BlocksList infinite limit={DEFAULT_LIST_LIMIT} />
    </Box>
  </>
);

export default BlocksPage;
