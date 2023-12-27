import { FC } from 'react';

import { ContractAvailableFunctions } from '../../../../common/components/ContractAvailableFunctions';
import { ContractWithParsedAbi } from '../../../../common/types/contract';
import { CodeEditor } from '../../../../ui/CodeEditor';
import { Tab } from '../../../../ui/Tab';
import { TabList } from '../../../../ui/TabList';
import { TabPanel } from '../../../../ui/TabPanel';
import { TabPanels } from '../../../../ui/TabPanels';
import { Tabs } from '../../../../ui/Tabs';

export const ContractTabs: FC<{
  contractId: string;
  source?: string;
  contract?: ContractWithParsedAbi;
}> = ({ contractId, source, contract }) => {
  if (!contract) return null;

  return (
    <Tabs isLazy>
      <TabList>
        {source && <Tab>Source code</Tab>}
        <Tab>Available functions</Tab>
      </TabList>
      <TabPanels>
        {source && (
          <TabPanel>
            <CodeEditor code={source} />
          </TabPanel>
        )}
        <TabPanel>
          <ContractAvailableFunctions contractId={contractId} contract={contract} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
  return null;
};
