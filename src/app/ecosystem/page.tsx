'use client';

import { PageTitle } from '@/app/common/components/PageTitle';
import { Flex, Grid } from '@/ui/components';
import type { NextPage } from 'next';
import * as React from 'react';

import { BlocksList } from '../components/BlockList';
import { HighLevelStats } from '@/app/ecosystem/components/HighlevelStats';
import { Title } from '@/ui/typography';
import { DEFAULT_BLOCKS_LIST_LIMIT } from '@/common/constants';
import { MonthlyActiveDevelopersChartSection } from '@/app/ecosystem/components/MonthlyActiveDevelopersChartSection';

const EcosystemPage: NextPage = () => (
  <Grid mt="32px" gap="32px" width="100%" gridTemplateColumns={['100%']}>
    <Title
      as="h1"
      fontSize="36px"
      display="block"
      width="100%"
      textAlign={['center', 'left']}
      mt="40px"
      mb="0"
      data-test="homepage-title"
      color="white"
    >
      Ecosystem
    </Title>
    <HighLevelStats />
    <MonthlyActiveDevelopersChartSection />
  </Grid>
);

export default EcosystemPage;
