import { useVerticallyStackedElementsBorderStyle } from '@/app/common/styles/border';
import { showFn } from '@/app/common/utils/sandbox';
import { useAppDispatch } from '@/common/state/hooks';
import { ContractWithParsedAbi } from '@/common/types/contract';
import { CodeEditor } from '@/ui/CodeEditor';
import { Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, TextLink } from '@/ui/components';
import { Caption } from '@/ui/typography';
import { FC, useState } from 'react';

import { ClarityAbiFunction } from '@stacks/transactions';

import { AbiFunction } from '../../../sandbox/components/ContractCall/AvailableFunctionsView';
import { FunctionView } from '../../../sandbox/components/ContractCall/FunctionView';
import { useUser } from '../../../sandbox/hooks/useUser';
import { setUserData } from '../../../sandbox/sandbox-slice';

export const ContractTabs: FC<{
  contractId: string;
  source?: string;
  contract?: ContractWithParsedAbi;
  claritySyntax: Record<string, any>;
}> = ({ contractId, source, contract, claritySyntax }) => {
  const { isConnected, connect } = useUser();
  const dispatch = useAppDispatch();
  const [functionName, setFunctionName] = useState('');
  const verticallyStackedElementsBorderStyle = useVerticallyStackedElementsBorderStyle();

  if (!contract) return null;

  return (
    <Tabs variant={'soft-rounded'} isLazy>
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
          {!isConnected ? (
            <Flex alignItems={'center'} justifyContent={'center'} py={'24px'}>
              <Button
                onClick={() =>
                  connect({
                    onFinish: authData => {
                      dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                    },
                  })
                }
              >
                Connect Stacks Wallet
              </Button>
            </Flex>
          ) : functionName ? (
            <FunctionView
              contractId={contractId}
              fn={
                contract?.abi?.functions?.find(
                  (fn: any) => fn.name === functionName
                ) as unknown as ClarityAbiFunction
              }
              cancelButton={
                <TextLink onClick={() => setFunctionName('')}>
                  <Caption _hover={{ cursor: 'pointer', color: 'textTitle' }} mt="16px">
                    Cancel
                  </Caption>
                </TextLink>
              }
            />
          ) : (
            contract?.abi?.functions.map(
              (abiFn: any) =>
                showFn(contractId, abiFn) && (
                  <AbiFunction
                    key={abiFn.name}
                    abiFn={abiFn}
                    onClick={() => {
                      setFunctionName(abiFn.name);
                    }}
                  />
                )
            )
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
  return null;
};
