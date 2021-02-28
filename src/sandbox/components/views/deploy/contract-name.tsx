import React from 'react';

import { Box, Flex, Input, IconButton, color } from '@stacks/ui';

import { useRecoilState } from 'recoil';
import { useRandomName } from '@common/hooks/use-random-name';
import { useHover } from 'use-events';

import CloseIcon from 'mdi-react/CloseIcon';
import { contractNameState } from '@sandbox/store/sandbox';
import RefreshIcon from 'mdi-react/RefreshIcon';

export const ContractName = React.memo(() => {
  const [name, setName] = useRecoilState(contractNameState);
  const randomName = useRandomName();

  const inputRef = React.useRef();
  return (
    <Flex
      border="1px solid transparent"
      alignItems="center"
      borderRadius="24px"
      position="relative"
    >
      <Input
        as="input"
        value={name}
        onChange={(e: any) => setName(e.target?.value as string)}
        placeholder="Name your contract"
        ref={inputRef as any}
        pr="84px"
      />
      <Flex position="absolute" right="tight">
        <IconButton
          color={color('text-body')}
          onClick={() => {
            setName('');
            (inputRef?.current as any)?.focus();
          }}
          icon={CloseIcon}
        />
        <IconButton
          color={color('text-body')}
          onClick={() => {
            setName(randomName());
          }}
          icon={RefreshIcon}
        />
      </Flex>
    </Flex>
  );
});
