'use client';

import * as React from 'react';
import { Fragment } from 'react';
import { TbChevronRight } from 'react-icons/tb';

import { ExplorerErrorBoundary } from '../../app/_components/ErrorBoundary';
import { Box } from '../../ui/Box';
import { CodeEditor } from '../../ui/CodeEditor';
import { useSuspenseContractById } from '../queries/useContractById';
import { Badge } from './Badge';
import { TxLink } from './ExplorerLinks';
import { Section } from './Section';

function ContractSourceBase({ txContractId }: { txContractId: string }) {
  const { data: txContract } = useSuspenseContractById(txContractId);
  const source = txContract.source_code;
  if (!source) return null;
  return (
    <Section
      title={'Source code'}
      topRight={
        <TxLink txId={txContractId} _hover={{ bg: '#eee', cursor: 'pointer' }} target="_blank">
          <Badge
            bg={'bgAlt'}
            labelProps={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap' }}
            border={'none'}
          >
            View deployment
            <Box as={TbChevronRight} ml="4px" size="14px" display={'inline'} />
          </Badge>
        </TxLink>
      }
    >
      <CodeEditor code={source} />
    </Section>
  );
}

export function ContractSource({ txContractId }: { txContractId: string }) {
  return (
    <ExplorerErrorBoundary Wrapper={Section} wrapperProps={{ title: 'Source code' }} tryAgainButton>
      <ContractSourceBase txContractId={txContractId} />
    </ExplorerErrorBoundary>
  );
}
