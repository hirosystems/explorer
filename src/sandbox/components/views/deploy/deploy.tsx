import React from 'react';
import { Box, Flex, Stack, useClipboard } from '@stacks/ui';
import { Button } from '@components/button';
import { useUser } from '@sandbox/hooks/use-user';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractNameState, editorToolsState } from '@sandbox/store/sandbox';
import { ContractName } from '@sandbox/components/views/deploy/contract-name';
import { useClarityRepl } from '@sandbox/hooks/use-clarity-repl';
import { useCodeEditor } from '@sandbox/components/code-editor/code-editor';

import { IconButton } from '@components/icon-button';
import { CopyIcon } from '@components/icons/copy';
import { Tooltip } from '@components/tooltip';
import CloseIcon from 'mdi-react/CloseIcon';
import { Caption } from '@components/typography';
import { ToolsIcon } from '@components/icons/tools';
import { Select } from '@components/select';
import { SampleContracts } from '@sandbox/common/examples';
import { useNetworkConfig } from '@common/hooks/use-network-config';
import { handleContractDeploy } from '@sandbox/common/connect-functions';
import { ClarityCodeEditor } from '@sandbox/components/clarity-editor';
import { useMonaco } from '@monaco-editor/react';

export const Sample = ({ onItemClick, setFieldValue }: any) => {
  const [codeBody, setCodeBody] = useCodeEditor();
  const { principal } = useUser();

  const monaco = useMonaco();

  return (
    <Select
      name="codeBody"
      label="Choose from sample"
      onItemClick={v => {
        setCodeBody(v.trim());
        if (monaco) {
          const model = monaco.editor.getModels();
          model[0].setValue(v.trim());
        }
      }}
      options={SampleContracts.map(({ name, source }, key: number) => ({
        label: name,
        value:
          key === 0
            ? source.replace('SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G', principal as string)
            : source,
        key,
      }))}
      flexGrow={1}
    />
  );
};

const Toolbar: React.FC<any> = props => {
  const [codeBody] = useCodeEditor();

  const { onCopy, hasCopied } = useClipboard(codeBody);
  const [toolsVisible, setToolsState] = useRecoilState(editorToolsState);

  const handleToggleToolsState = () => {
    setToolsState(s => (s === 'visible' ? 'hidden' : 'visible'));
  };
  return toolsVisible !== 'hidden' ? (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      p="base"
      borderBottom="1px solid"
      bg="ink"
      borderBottomColor="rgba(255,255,255,0.15)"
    >
      <Flex alignItems="center">
        <Caption mr="tight">Samples</Caption>
        <Box
          _hover={{
            cursor: 'pointer',
          }}
          maxWidth="320px"
        >
          <Sample />
        </Box>
      </Flex>
      <Stack ml="auto" isInline>
        <Box onClick={onCopy}>
          <Tooltip label={hasCopied ? 'Copied!' : 'Copy contract code'}>
            <IconButton icon={CopyIcon} />
          </Tooltip>
        </Box>
        <IconButton icon={CloseIcon} onClick={handleToggleToolsState} />
      </Stack>
    </Flex>
  ) : null;
};

export const DeployView = React.memo(() => {
  const { refreshPendingTransactions } = useUser();
  const [codeBody] = useCodeEditor();
  const { handleValidate, result, setResult } = useClarityRepl();

  const network = useNetworkConfig();

  const contractName = useRecoilValue(contractNameState);
  const [toolsVisible, setToolsState] = useRecoilState(editorToolsState);

  const onFinished = React.useCallback(() => {}, [refreshPendingTransactions]);

  const handleToggleToolsState = () => {
    setToolsState(s => (s === 'visible' ? 'hidden' : 'visible'));
  };

  const onDeploy = React.useCallback(() => {
    setResult(undefined);
    void handleContractDeploy({
      network,
      postConditionMode: 0x01,
      codeBody,
      contractName,
      onFinish: onFinished,
    });
  }, [codeBody, contractName, network, result, codeBody, handleValidate]);

  return (
    <Flex position="relative" flexDirection="column" flexGrow={1} bg="ink">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderBottomColor="rgba(255,255,255,0.15)"
        p="base"
      >
        <ContractName />
        <Stack alignItems="center" isInline spacing="tight">
          <Box onClick={handleToggleToolsState}>
            <Tooltip label="Contract tools">
              <IconButton icon={ToolsIcon} />
            </Tooltip>
          </Box>
          <Button onClick={onDeploy} py="tight" px="base-tight">
            Deploy
          </Button>
        </Stack>
      </Flex>
      <Toolbar />
      <ClarityCodeEditor />
    </Flex>
  );
});
