'use client';

import { Select, createListCollection, useClipboard } from '@chakra-ui/react';
import { useMonaco } from '@monaco-editor/react';
import { CopySimple, X } from '@phosphor-icons/react';
import React, { useState } from 'react';

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
import { Tooltip } from '../../../ui/Tooltip';
import { Caption } from '../../../ui/typography';
import { useUser } from '../hooks/useUser';
import {
  selectCodeBody,
  selectShowCodeToolbar,
  setCodeBody,
  toggleCodeToolbar,
} from '../sandbox-slice';

const contracts = createListCollection({
  items: [
    { label: helloWorldContract.name, value: helloWorldContract.source },
    { label: kvStoreContract.name, value: kvStoreContract.source },
    { label: statusContract.name, value: statusContract.source },
    { label: streamContract.name, value: streamContract.source },
  ],
});
export const Sample = () => {
  const { stxAddress } = useUser();
  const dispatch = useAppDispatch();
  const monaco = useMonaco();
  const [selectedContract, setSelectedContract] = useState<string[]>([]);

  return (
    <Select.Root
      name="codeBody"
      flexGrow={1}
      bg={'white'}
      color={`black`}
      fontSize={'sm'}
      collection={contracts}
      value={selectedContract}
      onValueChange={e => {
        dispatch(setCodeBody({ codeBody: e.value.trim() }));
        if (monaco) {
          const model = monaco.editor.getModels();
          model[0].setValue(e.value.trim());
        }
        setSelectedContract(e.value);
      }}
    >
      <Select.Trigger>
        <Select.ValueText placeholder="Choose from sample" />
      </Select.Trigger>
      <Select.Content>
        {contracts.items.map(({ label, value }, key) => (
          <Select.Item
            item={{
              label,
              value:
                key === 0
                  ? value.replace('SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G', stxAddress as string)
                  : value,
            }}
            key={value}
          >
            {label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
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
              <Icon as={CopySimple} size={4} color={'white'} />
            </IconButton>
          </Tooltip>
        </Box>
        <IconButton onClick={() => dispatch(toggleCodeToolbar())} aria-label={'close'}>
          <Icon as={X} size={4} color={'white'} />
        </IconButton>
      </HStack>
    </Flex>
  ) : null;
};
