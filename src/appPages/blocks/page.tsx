import type { NextPage } from 'next';

import { PageTitle } from '@/appPages/common/components/PageTitle';
import { Flex } from '@/ui/components';

import { BlocksList } from '../components/BlockList';

const BlocksPage: NextPage = () => (
  <Flex direction="column">
    <PageTitle>Blocks</PageTitle>
    <BlocksList />
  </Flex>
);

export default BlocksPage;
