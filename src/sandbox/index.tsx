import React, { useEffect } from 'react';
import type { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { SandboxPageContent } from '@sandbox/components/page-content';
import { Goals, useFathomGoal } from '@common/hooks/use-fathom';

const SandboxPage: NextPage<any> = () => {
  const { handleTrackGoal } = useFathomGoal();

  useEffect(() => {
    handleTrackGoal(Goals.SANDBOX_LOAD);
  }, []);

  return (
    <>
      <Head>
        <title>Sandbox | Stacks Explorer</title>
      </Head>
      <SandboxPageContent />
    </>
  );
};

SandboxPage.getInitialProps = (ctx: NextPageContext) => {
  const tab = ctx?.query?.tab ?? undefined;
  return { tab, fullWidth: true };
};

export default SandboxPage;
