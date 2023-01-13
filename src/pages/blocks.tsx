import { Meta } from '@/components/meta-head';
import * as React from 'react';

import AppBlocksPage from '../app/blocks/page';

export default function BlocksPage() {
  return (
    <>
      <Meta title="Recent Blocks" />
      <AppBlocksPage />
    </>
  );
}
