import Editor, { Monaco } from '@monaco-editor/react';
import CloseIcon from 'mdi-react/CloseIcon';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import React, { FC, useCallback, useState } from 'react';

import { openContractDeploy } from '@stacks/connect';
import { Box, Button, Flex, Grid, IconButton, Input, Stack, color } from '@stacks/ui';

import { CONNECT_AUTH_ORIGIN } from '@common/constants';
import { useNetworkConfig } from '@common/hooks/use-network-config';
import { useRandomName } from '@common/hooks/use-random-name';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';
import { border } from '@common/utils';

import { ToolsIcon } from '@components/icons/tools';
import { Tooltip } from '@components/tooltip';
import { Caption, Title } from '@components/typography';

import { ClarityIcon } from '@modules/sandbox/components/ClarityIcon';
import { Layout } from '@modules/sandbox/components/Layout';
import { Toolbar } from '@modules/sandbox/components/Toolbar';
import { autocomplete, hover } from '@modules/sandbox/editor-config/autocomplete';
import { defineTheme } from '@modules/sandbox/editor-config/define-theme';
import { liftOff } from '@modules/sandbox/editor-config/init';
import { configLanguage } from '@modules/sandbox/editor-config/language';
import { useUser } from '@modules/sandbox/hooks/useUser';
import {
  selectCodeBody,
  setCodeBody,
  setUserData,
  toggleCodeToolbar,
} from '@modules/sandbox/sandbox-slice';

const RightSection: FC = () => {
  const dispatch = useAppDispatch();
  const randomName = useRandomName();
  const { isConnected, connect } = useUser();
  const network = useNetworkConfig();
  const [contractName, setContractName] = useState(randomName());
  const codeBody = useAppSelector(selectCodeBody);

  const onDeploy = React.useCallback(() => {
    void openContractDeploy({
      network,
      postConditionMode: 0x01,
      codeBody,
      contractName,
      authOrigin: CONNECT_AUTH_ORIGIN,
    });
  }, [codeBody, contractName]);
  return (
    <>
      <Title mb="extra-loose" fontSize="24px">
        Write & Deploy
      </Title>
      <Caption mb="tight">Contract name</Caption>
      <Flex
        border="1px solid transparent"
        alignItems="center"
        borderRadius="24px"
        position="relative"
      >
        <Input
          as="input"
          value={contractName}
          onChange={(e: any) => setContractName(e.target?.value as string)}
          placeholder="Name your contract"
          pr="84px"
          color={color('text-body')}
        />
        <Flex position="absolute" right="tight">
          <IconButton
            color={color('text-body')}
            onClick={() => {
              setContractName('');
            }}
            icon={CloseIcon}
          />
        </Flex>
      </Flex>
      <Stack alignItems="center" justifyContent={'center'} isInline spacing="tight" mt="base-loose">
        <Box onClick={() => dispatch(toggleCodeToolbar())}>
          <Tooltip label="Contract tools">
            <IconButton icon={ToolsIcon} />
          </Tooltip>
        </Box>
        <Button
          onClick={() =>
            isConnected
              ? onDeploy()
              : connect({
                  onFinish: authData => {
                    dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                  },
                })
          }
          width="100%"
        >
          {isConnected ? 'Deploy' : 'Connect Stacks Wallet'}
        </Button>
      </Stack>
    </>
  );
};

interface LeftSectionProps {
  claritySyntax: string;
}

const LeftSection: FC<LeftSectionProps> = ({ claritySyntax }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const codeBody = useAppSelector(selectCodeBody);
  const handleEditorWillMount = useCallback(
    async (monaco: Monaco) => {
      if (!loaded) {
        configLanguage(monaco);
        hover(monaco);
        autocomplete(monaco);
        defineTheme(monaco);
        await liftOff(monaco, claritySyntax);

        setLoaded(true);
      }
    },
    [loaded, setLoaded, configLanguage, autocomplete, defineTheme, liftOff]
  );
  return (
    <>
      <Box
        px="extra-loose"
        pb="base"
        borderBottom={border()}
        borderBottomColor="rgba(255,255,255,0.1)"
        color="white"
      >
        <Stack alignItems="center" isInline>
          <ClarityIcon size="16px" />
          <Caption transform="translateY(1px)" color="white">
            Clarity code editor
          </Caption>
        </Stack>
      </Box>
      <Box size="100%" position="relative">
        <Toolbar />
        <Editor
          beforeMount={handleEditorWillMount}
          onMount={editor => {
            editor.updateOptions({
              wordSeparators: '`~!@#$%^&*()=+[{]}\\|;:\'",.<>/?',
            });
          }}
          wrapperClassName="clarity-editor-wrapper"
          className="clarity-editor"
          defaultLanguage="clarity"
          theme="vs-dark"
          defaultValue={codeBody}
          value={codeBody}
          onChange={updatedCodeBody => dispatch(setCodeBody({ codeBody: updatedCodeBody || '' }))}
          options={{
            fontLigatures: true,
            fontSize: 14,
            minimap: {
              enabled: false,
            },
          }}
        />
      </Box>
    </>
  );
};

const Deploy: NextPage = ({ claritySyntax }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout>
    <Grid minHeight="600px" gridTemplateColumns="365px 1fr" flexGrow={1} flexShrink={1}>
      <Flex flexDirection="column" flexGrow={1} p="loose">
        <RightSection />
      </Flex>
      <Flex flexDirection="column" bg="#282c34" pt="base" flexGrow={1} flexShrink={1}>
        <LeftSection claritySyntax={claritySyntax} />
      </Flex>
    </Grid>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  // Fetch Clarity grammar file only at build time
  const response = await fetch(
    'https://raw.githubusercontent.com/hirosystems/clarinet/main/components/clarity-vscode/syntaxes/clarity.tmLanguage.json'
  );
  const data = await response.text();

  return {
    props: { claritySyntax: data },
  };
};

export default Deploy;
