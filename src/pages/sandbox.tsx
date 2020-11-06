import React from 'react';
import type { NextPage } from 'next';
import type { ReduxNextPageContext } from '@common/types';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

import { Flex } from '@stacks/ui';
import { Title } from '@components/typography';
import { PageWrapper } from '@components/page';
import { UserCard } from '@components/sandbox/user-card';

const PageContent = dynamic(() => import('../components/sandbox/page'), { ssr: false });

const PageTop: React.FC = React.memo(() => (
  <Flex mb="extra-loose" flexDirection="row" alignItems="flex-end" justifyContent="space-between">
    <Title
      as="h1"
      fontSize="36px"
      display="block"
      textAlign={['center', 'left']}
      mt="72px"
      mb={0}
      color="white"
    >
      Explorer sandbox
    </Title>
    <UserCard />
  </Flex>
));

const SandboxPage: NextPage<any> = () => (
  <RecoilRoot>
    <PageWrapper>
      <Head>
        <title>Sandbox | Stacks Explorer</title>
      </Head>
      <PageTop />
      <PageContent />
    </PageWrapper>
  </RecoilRoot>
);

SandboxPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const tab = ctx?.query?.tab ?? undefined;
  return { tab };
};

export default SandboxPage;
