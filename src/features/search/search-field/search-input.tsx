import { Input, InputProps } from '@/ui/components';
import * as React from 'react';
import { FC } from 'react';

const StyledInput: FC<InputProps> = props => (
  <Input
    display="block"
    borderRadius="12px"
    bg="rgba(255,255,255,0.15)"
    p={0}
    top={0}
    left={0}
    pr="60px"
    right={0}
    bottom={0}
    type="text"
    name="search-bar"
    lineHeight="20px"
    fontSize="inherit"
    position="absolute"
    color="white"
    borderColor="rgba(255,255,255,0.25)"
    transitionProperty="border,box-shadow"
    backdropFilter="blur(10px)"
    _placeholder={{ color: 'white', opacity: 1 }}
    _hover={{
      borderColor: 'rgba(255,255,255,0.35)',
    }}
    _focus={{
      borderColor: 'rgba(255,255,255,0.5)',
      boxShadow: '0 0 0 3px rgba(170, 179, 255, 0.5)',
    }}
    boxShadow={'0 0 0 3px rgba(170, 179, 255, 0)'}
    autoComplete="off"
    id="search-bar"
    {...props}
  />
);

export const SearchInput: FC<InputProps> = props => (
  <StyledInput placeholder="Search the Stacks blockchain" {...props} />
);
