import React from 'react';
import { Box, Flex, Stack, useClipboard } from '@stacks/ui';
import { openContractDeploy } from '@stacks/connect';
import { WasmComponent } from '@components/clarity-repl';
import { CodeEditor } from '@components/code-editor';
import { Button } from '@components/button';
import { useUser } from '@common/hooks/use-user';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractNameState, editorToolsState } from '@store/sandbox';
import { ContractName } from '@components/sandbox/views/deploy/contract-name';
import { useClarityRepl } from '@common/hooks/use-clarity-repl';
import { useCodeEditor } from '@components/code-editor/code-editor';

import { IconButton } from '@components/icon-button';
import { CopyIcon } from '@components/icons/copy';
import { ScanIcon } from '@components/icons/scan';
import { Tooltip } from '@components/tooltip';
import CloseIcon from 'mdi-react/CloseIcon';
import { Caption } from '@components/typography';
import { ToolsIcon } from '@components/icons/tools';
import { Select } from '@components/select';
import { SampleContracts } from '@common/sandbox/examples';
import { useNetworkConfig } from '@common/hooks/use-network-config';

export const Sample = ({ onItemClick, setFieldValue }: any) => {
  const [codeBody, setCodeBody] = useCodeEditor();
  const { principal } = useUser();

  return (
    <Select
      name="codeBody"
      label="Choose from sample"
      onItemClick={v => setCodeBody(v.trim())}
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
  const { refreshPendingTransactions } = useUser();
  const [codeBody] = useCodeEditor();
  const { handleValidate, wasmLoaded } = useClarityRepl();
  const { onCopy, hasCopied } = useClipboard(codeBody);
  const [toolsVisible, setToolsState] = useRecoilState(editorToolsState);

  // const handleCopy =

  const handleToggleToolsState = () => {
    setToolsState(s => (s === 'visible' ? 'hidden' : 'visible'));
  };
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      p="base"
      borderBottom="1px solid rgb(39, 41, 46)"
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
        {wasmLoaded && (
          <Box>
            <Tooltip label="Validate contract">
              <IconButton onClick={() => handleValidate(codeBody)} icon={ScanIcon} />
            </Tooltip>
          </Box>
        )}
        <Box onClick={onCopy}>
          <Tooltip label={hasCopied ? 'Copied!' : 'Copy contract code'}>
            <IconButton icon={CopyIcon} />
          </Tooltip>
        </Box>
        {/*<Box>*/}
        {/*  <Tooltip*/}
        {/*    style={{*/}
        {/*      color: 'black',*/}
        {/*      backgroundColor: 'white',*/}
        {/*    }}*/}
        {/*    label="Get share link"*/}
        {/*  >*/}
        {/*    <IconButton icon={ShareIcon} />*/}
        {/*  </Tooltip>*/}
        {/*</Box>*/}
        <IconButton icon={CloseIcon} onClick={handleToggleToolsState} />
      </Stack>
    </Flex>
  );
};

export const DeployView = React.memo(() => {
  const { refreshPendingTransactions } = useUser();
  const [codeBody] = useCodeEditor();
  const { handleValidate, result, setResult, wasmLoaded } = useClarityRepl();

  const network = useNetworkConfig();

  const contractName = useRecoilValue(contractNameState);
  const [toolsVisible, setToolsState] = useRecoilState(editorToolsState);

  const onFinished = React.useCallback(() => {
    refreshPendingTransactions && refreshPendingTransactions();
  }, [refreshPendingTransactions]);

  const handleToggleToolsState = () => {
    setToolsState(s => (s === 'visible' ? 'hidden' : 'visible'));
  };

  const onDeploy = React.useCallback(() => {
    const _result = handleValidate(codeBody);
    if (!wasmLoaded || (_result && _result?.valid)) {
      setResult(undefined);
      void openContractDeploy({
        network,
        postConditionMode: 0x01,
        codeBody,
        contractName,
        finished: onFinished,
      });
    } else {
      if (toolsVisible === 'hidden') {
        handleToggleToolsState();
      }
    }
  }, [codeBody, contractName, result, codeBody, handleValidate]);

  return (
    <Flex position="relative" flexDirection="column" flexGrow={1} bg="ink">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderBottomColor="rgb(39, 41, 46)"
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
      {toolsVisible === 'visible' ? <Toolbar /> : null}
      <WasmComponent show={toolsVisible === 'visible'} />
      <CodeEditor maxHeight="862px" minHeight="862px" flexGrow={1} language="clarity" />
    </Flex>
  );
});
