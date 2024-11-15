import { Tabs } from '@chakra-ui/react';
import { FC } from 'react';

import { ContractAvailableFunctions } from '../../../../common/components/ContractAvailableFunctions';
import { ContractWithParsedAbi } from '../../../../common/types/contract';
import { CodeEditor } from '../../../../ui/CodeEditor';
import { Tab } from '../../../../ui/Tab';

export const ContractTabs: FC<{
  contractId: string;
  source?: string;
  contract?: ContractWithParsedAbi;
}> = ({ contractId, source, contract }) => {
  if (!contract) return null;

  return (
    <Tabs.Root lazyMount>
      <Tabs.List>
        {source && <Tabs.Trigger value="source">Source code</Tabs.Trigger>}
        <Tab>Available functions</Tab>
      </Tabs.List>
      <Tabs.Content value="source">
        <CodeEditor code={source || ''} />
      </Tabs.Content>
      <Tabs.Content value="available-functions">
        <ContractAvailableFunctions contractId={contractId} contract={contract} />
      </Tabs.Content>
    </Tabs.Root>
  );
  return null;
};
