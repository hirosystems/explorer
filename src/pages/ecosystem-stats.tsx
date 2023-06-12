import { Meta } from '@/components/meta-head';
import * as React from 'react';

import AppEcosystemPage from '@/app/ecosystem-stats/page';
import { TableContainer } from '@/ui/TableContainer';
import { TableCaption } from '@/ui/TableCaption';
import { Thead } from '@/ui/Thead';
import { Tr } from '@/ui/Tr';
import { Th } from '@/ui/Th';
import { Tbody } from '@/ui/Tbody';
import { Td } from '@/ui/Td';
import { Tfoot } from '@/ui/Tfoot';
import { Table } from '@/ui/Table';

export default function EcosystemStatsPage() {
  return (
    <>
      <Meta title="Ecosystem" />
      <AppEcosystemPage />
    </>
  );
}
