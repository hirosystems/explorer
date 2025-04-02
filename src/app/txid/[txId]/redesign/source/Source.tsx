'use client';

import { useGlobalContext } from '@/common/context/useGlobalContext';
import { useContractById } from '@/common/queries/useContractById';
import { buildUrl } from '@/common/utils/buildUrl';
import { ButtonLink } from '@/ui/ButtonLink';
import { Stack } from '@chakra-ui/react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { CodeEditor, withControls } from './CodeEditor';

const CodeEditorWithControls = withControls(CodeEditor, true, true);

export function Source({
  tx,
}: {
  tx:
    | ContractCallTransaction
    | MempoolContractCallTransaction
    | SmartContractTransaction
    | MempoolSmartContractTransaction;
}) {
  const txContractId =
    'contract_call' in tx ? tx.contract_call.contract_id : tx.smart_contract.contract_id;
  const { data: txContract } = useContractById(txContractId);
  const sourceCode = txContract?.source_code;
  const network = useGlobalContext().activeNetwork;
  return (
    <Stack gap={3}>
      <ButtonLink
        href={buildUrl(`/txid/${encodeURIComponent(txContractId)}`, network)}
        buttonLinkSize="small"
        aria-label="View deployment"
      >
        View deployment{' '}
      </ButtonLink>
      <CodeEditorWithControls code={sourceCode || ''} />
    </Stack>
  );
}
