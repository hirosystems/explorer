import { useMonaco } from '@monaco-editor/react';
import CloseIcon from 'mdi-react/CloseIcon';
import React from 'react';

import { Box, Flex, Stack, useClipboard } from '@stacks/ui';

import { helloWorldContract } from '@common/contracts/hello-world-contract';
import { kvStoreContract } from '@common/contracts/kv-store';
import { statusContract } from '@common/contracts/status';
import { streamContract } from '@common/contracts/stream';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';

import { IconButton } from '@components/icon-button';
import { CopyIcon } from '@components/icons/copy';
import { Select } from '@components/select';
import { Tooltip } from '@components/tooltip';
import { Caption } from '@components/typography';

import { useUser } from '@modules/sandbox/hooks/useUser';
import {
  selectCodeBody,
  selectShowCodeToolbar,
  setCodeBody,
  toggleCodeToolbar,
} from '@modules/sandbox/sandbox-slice';

export const Sample = () => {
  const { stxAddress } = useUser();
  const dispatch = useAppDispatch();
  const monaco = useMonaco();

  return (
    <Select
      name="codeBody"
      label="Choose from sample"
      onItemClick={v => {
        dispatch(setCodeBody({ codeBody: v.trim() }));
        if (monaco) {
          const model = monaco.editor.getModels();
          model[0].setValue(v.trim());
        }
      }}
      options={[helloWorldContract, kvStoreContract, statusContract, streamContract].map(
        ({ name, source }, key: number) => ({
          label: name,
          value:
            key === 0
              ? source.replace('SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G', stxAddress as string)
              : source,
          key,
        })
      )}
      flexGrow={1}
    />
  );
};

export const Toolbar: React.FC<any> = () => {
  const codeBody = useAppSelector(selectCodeBody);
  const dispatch = useAppDispatch();
  const { onCopy, hasCopied } = useClipboard(codeBody);

  const showCodeToolbar = useAppSelector(selectShowCodeToolbar);
  return showCodeToolbar ? (
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
        <IconButton icon={CloseIcon} onClick={() => dispatch(toggleCodeToolbar())} />
      </Stack>
    </Flex>
  ) : null;
};
