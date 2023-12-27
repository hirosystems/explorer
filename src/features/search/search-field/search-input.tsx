import * as React from 'react';

import { Input, InputProps } from '../../../ui/Input';

export function SearchInput(props: InputProps) {
  return (
    <Input
      id="search-bar"
      name="search-bar"
      display="block"
      borderRadius="xl"
      bg="whiteAlpha.200"
      type="text"
      fontSize="sm"
      color="slate.50"
      borderColor="whiteAlpha.600"
      transitionProperty="border,box-shadow"
      boxShadow={'0 0 0 1px var(--stacks-colors-whiteAlpha-200)'}
      autoComplete="off"
      placeholder="Search the Stacks blockchain"
      pl={12}
      maxW={'lg'}
      _placeholder={{ color: 'white' }}
      _hover={{
        borderColor: 'whiteAlpha.500',
      }}
      _focus={{
        borderColor: 'whiteAlpha.500',
        boxShadow: '0 0 0 1px var(--stacks-colors-whiteAlpha-500)',
      }}
      {...props}
    />
  );
}
