import React from 'react';
import type { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { SandboxPageContent } from '@sandbox/components/page-content';

const SandboxPage: NextPage<any> = () => (
  <>
    <Head>
      <title>Sandbox | Stacks Explorer</title>
    </Head>
    <SandboxPageContent />
  </>
);

SandboxPage.getInitialProps = async (ctx: NextPageContext) => {
  const tab = ctx?.query?.tab ?? undefined;
  return { tab, fullWidth: true };
};

export default SandboxPage;
