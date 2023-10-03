import { useVerticallyStackedElementsBorderStyle } from '@/appPages/common/styles/border';
import { ContractWithParsedAbi } from '@/common/types/contract';
import { CodeEditor } from '@/ui/CodeEditor';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@/ui/components';
import { ContractAvailableFunctions } from '@/appPages/common/components/ContractAvailableFunctions';

export function ContractTabs({
  contractId,
  source,
  contract,
  claritySyntax,
}: {
  contractId: string;
  source?: string;
  contract?: ContractWithParsedAbi;
  claritySyntax: Record<string, any>;
}) {
  const verticallyStackedElementsBorderStyle = useVerticallyStackedElementsBorderStyle();

  if (!contract) return null;

  return (
    <Tabs variant="soft-rounded" isLazy>
      <TabList>
        {source && <Tab>Source code</Tab>}
        <Tab>Available functions</Tab>
      </TabList>
      <TabPanels>
        {source && (
          <TabPanel>
            <CodeEditor code={source} claritySyntax={claritySyntax} />
          </TabPanel>
        )}
        <TabPanel css={verticallyStackedElementsBorderStyle}>
          <ContractAvailableFunctions contractId={contractId} contract={contract} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
  return null;
}
