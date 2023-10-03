import { useClipboard } from '@chakra-ui/react';
import { useMonaco } from '@monaco-editor/react';
import React from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { RiCloseLine } from 'react-icons/ri';
import { helloWorldContract } from '@/common/contracts/hello-world-contract';
import { kvStoreContract } from '@/common/contracts/kv-store';
import { statusContract } from '@/common/contracts/status';
import { streamContract } from '@/common/contracts/stream';
import { useAppDispatch, useAppSelector } from '@/common/state/hooks';
import { Box, Flex, IconButton, Select, Stack, Tooltip } from '@/ui/components';
import { Caption } from '@/ui/typography';

import { useUser } from '../hooks/useUser';
import {
  selectCodeBody,
  selectShowCodeToolbar,
  setCodeBody,
  toggleCodeToolbar,
} from '../sandbox-slice';

export const Sample = () => {
  const { stxAddress } = useUser();
  const dispatch = useAppDispatch();
  const monaco = useMonaco();

  return (
    <Select
      name="codeBody"
      placeholder="Choose from sample"
      onChange={e => {
        dispatch(setCodeBody({ codeBody: e.target.value.trim() }));
        if (monaco) {
          const model = monaco.editor.getModels();
          model[0].setValue(e.target.value.trim());
        }
      }}
      flexGrow={1}
      bg="white"
      color="black"
    >
      {[helloWorldContract, kvStoreContract, statusContract, streamContract].map(
        ({ name, source }, key: number) => (
          <option
            key={name}
            label={name}
            value={
              key === 0
                ? source.replace('SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G', stxAddress as string)
                : source
            }
          >
            {name}
          </option>
        )
      )}
    </Select>
  );
};

export function Toolbar() {
  const codeBody = useAppSelector(selectCodeBody);
  const dispatch = useAppDispatch();
  const { onCopy, hasCopied } = useClipboard(codeBody);

  const showCodeToolbar = useAppSelector(selectShowCodeToolbar);
  return showCodeToolbar ? (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      p="16px"
      borderBottomWidth="1px"
      bg="ink"
      borderBottomColor="rgba(255,255,255,0.15)"
    >
      <Flex alignItems="center">
        <Caption mr="8px">Samples</Caption>
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
            <IconButton
              icon={<AiOutlineCopy strokeWidth={1.75} size="20px" color="textBody" />}
              aria-label="copy"
            />
          </Tooltip>
        </Box>
        <IconButton
          icon={<RiCloseLine strokeWidth={1.75} size="20px" color="textBody" />}
          onClick={() => dispatch(toggleCodeToolbar())}
          aria-label="close"
        />
      </Stack>
    </Flex>
  ) : null;
}
