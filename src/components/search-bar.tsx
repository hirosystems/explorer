import React from 'react';
import { Box, Input } from '@blockstack/ui';
import { MagnifyingGlass } from './icons/magnifying-glass';

interface SearchBarProps {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const SearchBar = ({ onChange }: SearchBarProps) => (
  <Box position="relative" width="100%" height="64px">
    <Input
      cursor="pointer"
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      pl="50px"
      height="64px"
      placeholder="Search for transactions or contracts"
      type="text"
      onChange={onChange}
      fontSize="16px"
    />
    <MagnifyingGlass zIndex={2} top="22px" left="22px" style={{ pointerEvents: 'none' }} />
  </Box>
);
