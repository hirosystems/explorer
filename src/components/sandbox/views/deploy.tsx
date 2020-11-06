import React from 'react';
import { Flex, Stack } from '@stacks/ui';
import { openContractDeploy } from '@stacks/connect';
import { WasmComponent } from '@components/clarity-repl';
import { CodeEditor } from '@components/code-editor';
import { Button } from '@components/button';
import { useUser } from '@common/hooks/use-user';
import { useRecoilValue } from 'recoil';
import { contractNameState } from '@components/sandbox/state/atoms';
import { ContractName } from '@components/sandbox/deploy/contract-name';
import { useClarityRepl } from '@common/hooks/use-clarity-repl';
import { useCodeEditor } from '@components/code-editor/code-editor';
import { helloWorldContract } from '@common/sandbox/contracts';

export const DeployView = React.memo(() => {
  const { refreshPendingTransactions } = useUser();
  const [codeBody] = useCodeEditor();
  const { handleValidate, result } = useClarityRepl();

  const contractName = useRecoilValue(contractNameState);

  const onFinished = React.useCallback(() => {
    refreshPendingTransactions && refreshPendingTransactions();
  }, [refreshPendingTransactions]);

  const onDeploy = React.useCallback(() => {
    const _result = handleValidate(codeBody);
    if (_result && _result?.valid) {
      void openContractDeploy({
        codeBody,
        contractName,
        finished: onFinished,
      });
    }
  }, [codeBody, contractName, result, codeBody, handleValidate]);

  return (
    <Flex position="relative" flexDirection="column" flexGrow={1} bg="ink">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderBottomColor="ink.900"
        p="base"
      >
        <ContractName />
        <Stack isInline spacing="tight">
          <Button
            variant="secondary"
            onClick={() => handleValidate(codeBody)}
            py="tight"
            px="base-tight"
          >
            Validate
          </Button>
          <Button onClick={onDeploy} py="tight" px="base-tight">
            Deploy
          </Button>
        </Stack>
      </Flex>
      <WasmComponent />
      <CodeEditor
        value={helloWorldContract.source}
        maxHeight="862px"
        flexGrow={1}
        language="clarity"
      />
    </Flex>
  );
});
