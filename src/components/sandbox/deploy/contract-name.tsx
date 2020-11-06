import React from 'react';

import { Box, Flex } from '@stacks/ui';

import { useRecoilState } from 'recoil';
import { useRandomName } from '@common/hooks/use-random-name';
import { useHover } from 'use-events';

import CloseIcon from 'mdi-react/CloseIcon';
import { IconButton } from '@components/icon-button';
import { GiftIcon } from '@components/icons/gift';
import { contractNameState } from '@components/sandbox/state/atoms';
import RefreshIcon from 'mdi-react/RefreshIcon';

export const ContractName = React.memo(() => {
  const [name, setName] = useRecoilState(contractNameState);
  const randomName = useRandomName();
  const [hovered, bind] = useHover();
  const inputRef = React.useRef();
  return (
    <Flex border="1px solid transparent" borderRadius="24px" pr="base" color="white" {...bind}>
      <Box
        mr="base"
        as="input"
        bg="transparent"
        border={0}
        minWidth="250px"
        color="white"
        value={name}
        onChange={(e: any) => setName(e.target?.value as string)}
        outline={0}
        placeholder="Name your contract"
        ref={inputRef as any}
      />
      <Flex
        _hover={{
          cursor: 'pointer',
        }}
        opacity={hovered ? 1 : 0}
      >
        <IconButton
          opacity={0.5}
          _hover={{
            opacity: 1,
          }}
          onClick={() => {
            setName('');
            (inputRef?.current as any)?.focus();
          }}
          icon={CloseIcon}
        />
        <IconButton
          opacity={0.5}
          _hover={{
            opacity: 1,
          }}
          onClick={() => {
            setName(randomName());
          }}
          icon={RefreshIcon}
        />
      </Flex>
    </Flex>
  );
});
