import * as React from 'react';
import { Box, BoxProps, Grid, Input, InputProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs, memoWithAs } from '@stacks/ui-core';
import { IconSearch } from '@tabler/icons';

const SearchIcon: React.FC<
  BoxProps & { inputOffset: string }
> = React.memo(({ inputOffset, ...props }) => (
  <Box
    as={IconSearch}
    size="18px"
    strokeWidth={2}
    style={{ pointerEvents: 'none' }}
    color="white"
    {...props}
  />
));

const StyledInput = memoWithAs<InputProps & { hasError?: boolean }, 'input'>(
  forwardRefWithAs<InputProps & { hasError?: boolean }, 'input'>(
    ({ as = 'input', hasError, ...rest }, ref) => {
      return (
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
          borderColor="transparent"
          _placeholder={{ color: 'rgba(255,255,255,0.65)' }}
          _hover={{
            borderColor: 'rgba(255,255,255,0.15)',
          }}
          _focus={{
            borderColor: 'rgba(255,255,255,0.5)',
            boxShadow: hasError
              ? `0 0 0 3px rgba(212, 0, 26, 0.5)`
              : `0 0 0 3px rgba(170, 179, 255, 0.5)`,
          }}
          boxShadow={
            hasError ? `0 0 0 3px rgba(212, 0, 26, 0.5)` : `0 0 0 3px rgba(170, 179, 255, 0)`
          }
          ref={ref}
          autoComplete="off"
          id="search-bar"
          {...rest}
        />
      );
    }
  )
);

export const SearchInput: ForwardRefExoticComponentWithAs<InputProps, 'input'> = memoWithAs(
  forwardRefWithAs<InputProps, 'input'>(({ ...rest }, ref) => (
    <StyledInput placeholder="Search the Stacks blockchain" ref={ref} {...rest} />
  ))
);
