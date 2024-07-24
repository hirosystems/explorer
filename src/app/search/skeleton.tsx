'use client';

import * as React from 'react';

import { Section } from '../../common/components/Section';
import { SkeletonTxsList } from '../../features/txs-list/SkeletonTxsList';

export default function Skeleton() {
  return (
    <Section>
      <SkeletonTxsList txsCount={20} />
    </Section>
  );
}
