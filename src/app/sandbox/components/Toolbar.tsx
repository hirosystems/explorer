'use client';

import { Box, Flex, HStack, Icon, useClipboard } from '@chakra-ui/react';
import { useMonaco } from '@monaco-editor/react';
import { CopySimple, X } from '@phosphor-icons/react';
import React from 'react';

import { helloWorldContract } from '../../../common/constants/contracts/hello-world-contract';
import { kvStoreContract } from '../../../common/constants/contracts/kv-store';
import { statusContract } from '../../../common/constants/contracts/status';
import { streamContract } from '../../../common/constants/contracts/stream';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import { NativeSelectField, NativeSelectRoot } from '../../../components/ui/native-select';
import { IconButton } from '../../../ui/IconButton';
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
    <NativeSelectRoot
      placeholder="Choose from sample"
      onChange={e => {
        dispatch(
          setCodeBody({
            codeBody: (e as unknown as React.ChangeEvent<HTMLSelectElement>).target.value.trim(),
          })
        );
        if (monaco) {
          const model = monaco.editor.getModels();
          model[0].setValue(
            (e as unknown as React.ChangeEvent<HTMLSelectElement>).target.value.trim()
          );
        }
      }}
      flexGrow={1}
      bg={'white'}
      color={`black`}
      fontSize={'sm'}
    >
      <NativeSelectField placeholder="Choose from sample">
        {[helloWorldContract, kvStoreContract, statusContract, streamContract].map(
          ({ name, source }, key: number) => (
            <option
              key={name}
              label={name}
              value={
                key === 0
                  ? source.replace(
                      'SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G',
                      stxAddress as string
                    )
                  : source
              }
            >
              {name}
            </option>
          )
        )}
      </NativeSelectField>
    </NativeSelectRoot>
  );
};

export const Toolbar: React.FC<any> = () => {
  const codeBody = useAppSelector(selectCodeBody);
  const dispatch = useAppDispatch();
  const { setValue: onCopy, copied } = useClipboard({ value: codeBody });

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
        <Box onClick={() => onCopy(codeBody)}>
          <Tooltip content={copied ? 'Copied!' : 'Copy contract code'}>
            <IconButton aria-label={'copy'}>
              <Icon h={4} w={4} color={'white'}>
                <CopySimple />
              </Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <IconButton onClick={() => dispatch(toggleCodeToolbar())} aria-label={'close'}>
          <Icon h={4} w={4} color={'white'}>
            <X />
          </Icon>
        </IconButton>
      </HStack>
    </Flex>
  ) : null;
};
