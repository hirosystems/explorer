import * as React from 'react';
import { forwardRef, Ref } from 'react';
import { Box, Input, Text, BoxProps } from '@blockstack/ui';
import { MagnifyingGlass } from './icons/magnifying-glass';
import { useFocus, useHover } from 'use-events';
import { RecentlyViewed, RecentlyViewedProps } from '@components/recently-viewed';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';

export interface SearchBarProps extends BoxProps {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  inputOffset?: string;
  boxProps?: BoxProps;
  recentlyViewedProps?: RecentlyViewedProps;
}

export const SearchBar = forwardRef(
  ({ onChange, inputOffset = '50px', ...rest }: SearchBarProps, ref: Ref<HTMLDivElement>) => (
    <Box
      position="relative"
      width="100%"
      height="64px"
      borderRadius="6px"
      bg="var(--colors-bg-alt)"
      ref={ref}
      {...rest}
    >
      <label>
        <Text display="block" position="absolute" zIndex={-1}>
          Search for transactions on the Stacks blockchain
        </Text>
        <Input
          p={0}
          top={0}
          left={0}
          pr="base"
          right={0}
          bottom={0}
          type="text"
          height="100%"
          pl={inputOffset}
          lineHeight="20px"
          fontSize="inherit"
          position="absolute"
          onChange={onChange}
          backgroundColor="transparent"
          color="var(--colors-text-body)"
          borderColor="var(--colors-border)"
          _placeholder={{ color: 'var(--colors-text-caption)' }}
          placeholder="Search for transactions on the Stacks blockchain"
          _hover={{
            borderColor: 'var(--colors-border)',
          }}
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
  )
);

export const SearchBarWithDropdown: React.FC<SearchBarProps> = ({
  onChange,
  boxProps = {},
  recentlyViewedProps = {},
  ...props
}) => {
  const [isHovered, hoverBind] = useHover();
  const [isFocused, focusBind] = useFocus();
  const transactions = useRecentlyViewedTx();
  const visible = isHovered || isFocused;
  return (
    <Box position="relative" width="100%" {...boxProps}>
      <SearchBar width="100%" onChange={onChange} {...props} {...focusBind} />
      <Box
        style={{ pointerEvents: visible ? 'unset' : 'none' }}
        pt="tight"
        position="absolute"
        zIndex={10000}
        width="100%"
        left={0}
        top="100%"
        {...hoverBind}
      >
        <RecentlyViewed
          transition="0.12s all ease-in-out"
          transform={visible ? 'none' : 'translateY(5px)'}
          opacity={visible ? 1 : 0}
          transactions={transactions}
        />
      </Box>
    </Box>
  );
};
