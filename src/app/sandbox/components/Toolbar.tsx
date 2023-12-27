'use client';

import { useClipboard } from '@chakra-ui/react';
import { useMonaco } from '@monaco-editor/react';
import React from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { RiCloseLine } from 'react-icons/ri';

import { helloWorldContract } from '../../../common/constants/contracts/hello-world-contract';
import { kvStoreContract } from '../../../common/constants/contracts/kv-store';
import { statusContract } from '../../../common/constants/contracts/status';
import { streamContract } from '../../../common/constants/contracts/stream';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
import { Select } from '../../../ui/Select';
import { Stack } from '../../../ui/Stack';
import { Tooltip } from '../../../ui/Tooltip';
import { Caption } from '../../../ui/typography';
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
      bg={'white'}
      color={`black`}
      fontSize={'sm'}
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

export const Toolbar: React.FC<any> = () => {
  const codeBody = useAppSelector(selectCodeBody);
  const dispatch = useAppDispatch();
  const { onCopy, hasCopied } = useClipboard(codeBody);

  const showCodeToolbar = useAppSelector(selectShowCodeToolbar);
  return showCodeToolbar ? (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      p={4}
      position={'absolute'}
      top={0}
      left={0}
      zIndex={'docked'}
      width={'full'}
      bg={'whiteAlpha.400'}
    >
      <Flex alignItems="center" gap={2}>
        <Caption color={'white'}>Samples</Caption>
        <Sample />
      </Flex>
      <HStack ml="auto">
        <Box onClick={onCopy}>
          <Tooltip label={hasCopied ? 'Copied!' : 'Copy contract code'}>
            <IconButton
              icon={<Icon as={AiOutlineCopy} size={4} color={'white'} />}
              aria-label={'copy'}
            />
          </Tooltip>
        </Box>
        <IconButton
          icon={<Icon as={RiCloseLine} size={4} color={'white'} />}
          onClick={() => dispatch(toggleCodeToolbar())}
          aria-label={'close'}
        />
      </HStack>
    </Flex>
  ) : null;
};
