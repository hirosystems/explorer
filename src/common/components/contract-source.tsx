'use client';

import { Flex } from '@chakra-ui/react';

import { ExplorerErrorBoundary } from '../../app/_components/ErrorBoundary';
import { CodeEditor } from '../../ui/CodeEditor';
import { Caption } from '../../ui/typography';
import { useContractById } from '../queries/useContractById';
import { TxLink } from './ExplorerLinks';
import { Section } from './Section';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { Icon } from '@/ui/Icon';


function ContractSourceBase({ txContractId }: { txContractId: string }) {
  const { data: txContract } = useContractById(txContractId);
  const source = txContract?.source_code;
  if (!source) return null;
  return (
    <Section
      title={'Source code'}
      topRight={
        <TxLink txId={txContractId} color={'accent'} target="_blank">
          <Flex alignItems="center" gap={'8px'}>
            <Caption transform="translateY(1px)" color="currentColor">
              View deployment
            </Caption>
            <Icon size={4}>
              <ArrowSquareOut />
            </Icon>
          </Flex>
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
