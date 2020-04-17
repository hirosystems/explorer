import React from 'react';
import { Box, Input, Text, BoxProps } from '@blockstack/ui';
import { MagnifyingGlass } from './icons/magnifying-glass';

interface SearchBarProps extends BoxProps {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  inputOffset?: string;
}

export const SearchBar = ({ onChange, inputOffset = '50px', ...rest }: SearchBarProps) => (
  <Box
    position="relative"
    width="100%"
    height="64px"
    borderRadius="6px"
    background="white"
    {...rest}
  >
    <label>
      <Text display="block" position="absolute" zIndex={-1}>
        Search for transactions on the Stacks blockchain
      </Text>
      <Input
        type="text"
        cursor="pointer"
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        lineHeight="20px"
        p={0}
        pl={inputOffset}
        height="100%"
        placeholder="Search for transactions"
        onChange={onChange}
        fontSize="inherit"
        backgroundColor="transparent"
        _placeholder={{ color: '#677282' }}
      />
      <MagnifyingGlass
        position="absolute"
        zIndex={2}
        top="50%"
        transform="translateY(-50%)"
        left={`calc(${inputOffset} / 2 - 6px)`}
        style={{ pointerEvents: 'none' }}
      />
    </label>
  </Box>
);
