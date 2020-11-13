// @ts-nocheck
import * as React from 'react';
import { Box, BoxProps, Flex, Input, transition } from '@stacks/ui';
import { SearchBarProps } from '@components/search-bar/types';
import { css, ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
import { MagnifyingGlass } from '../icons/magnifying-glass';
import { forwardRef } from 'react';
import { IconButton } from '@components/icon-button';
import QuestionMarkCircleOutlineIcon from 'mdi-react/QuestionMarkCircleOutlineIcon';
import { Tooltip } from '@components/tooltip';
import { useHover } from 'use-events';
import { useSearch } from '@common/hooks/use-search';
import { useFocusWithin } from '@react-aria/interactions';

import dynamic from 'next/dynamic';

import CloseIcon from 'mdi-react/CloseIcon';

const SearchResultsCard = dynamic(() => import('../search-results'), { ssr: false });

export const SearchBar: ForwardRefExoticComponentWithAs<SearchBarProps, 'div'> = forwardRefWithAs<
  SearchBarProps,
  'div'
>(
  (
    {
      onChange,
      inputOffset: _inputOffset = '25px',
      error,
      height,
      clearError,
      value = '',
      small,
      transform,
      ...rest
    },
    ref
  ) => {
    const inputOffset = small ? '38px' : '50px';
    return (
      <Box position="relative" transform={transform} {...rest}>
        <Box
          position="relative"
          width="100%"
          height={height || '64px'}
          borderRadius="12px"
          bg="rgba(255,255,255,0.15)"
        >
          <Input
            p={0}
            top={0}
            left={0}
            width="100%"
            pr="60px"
            right={0}
            bottom={0}
            type="text"
            height="100%"
            name="txSearchBar"
            pl={inputOffset}
            lineHeight="20px"
            fontSize="inherit"
            position="absolute"
            borderRadius="12px"
            border="1px solid"
            onChange={onChange}
            backgroundColor="transparent"
            color="white"
            borderColor="transparent"
            _placeholder={{ color: 'white' }}
            placeholder="Search the Stacks blockchain"
            _hover={{
              borderColor: 'rgba(255,255,255,0.15)',
            }}
            _focus={{
              borderColor: 'rgba(255,255,255,0.5)',
              boxShadow: error
                ? `0 0 0 3px rgba(212, 0, 26, 0.5)`
                : `0 0 0 3px rgba(170, 179, 255, 0.5)`,
            }}
            boxShadow={
              error ? `0 0 0 3px rgba(212, 0, 26, 0.5)` : `0 0 0 3px rgba(170, 179, 255, 0)`
            }
            ref={ref}
            autoComplete="off"
            id="search-bar"
          />
          <MagnifyingGlass
            size="18px"
            position="absolute"
            zIndex={2}
            top="50%"
            strokeWidth={2}
            transform="translateY(-50%)"
            left={`calc(${inputOffset} / 2 - 6px)`}
            style={{ pointerEvents: 'none' }}
            color="white"
          />
        </Box>
      </Box>
    );
  }
);

const Search: React.FC<{ small?: boolean } & BoxProps> = React.memo(
  forwardRef(({ small, ...rest }, ref) => {
    const { handleSearch, clearError } = useSearch(ref);

    return (
      <SearchBar
        css={theme =>
          css({
            'input[type="search"]::-webkit-search-cancel-button': {
              appearance: 'none',
              height: '1em',
              width: '1em',
              borderRadius: '50em',
              background:
                'url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg) no-repeat 50% 50%',
              backgroundSize: 'contain',
              opacity: '0.5',
              cursor: 'pointer',
              '&:hover': {
                opacity: 1,
              },
            },
          })(theme)
        }
        height={small ? '42px' : undefined}
        width="100%"
        onChange={handleSearch}
        clearError={clearError}
        small={small}
        ref={ref}
        {...(rest as any)}
      />
    );
  })
);

export const SearchBarWithDropdown: React.FC<Omit<SearchBarProps, 'value'>> = ({
  boxProps = {},
  recentlyViewedProps = {},
  small,
  hideBackdrop,
  ...props
}) => {
  const ref = React.useRef();
  const { setHover, query, clearQuery, setFocus } = useSearch(ref);

  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: e => setFocus(true),
    onBlurWithin: e => setFocus(false),
  });

  const [isHovered, bind] = useHover();

  React.useEffect(() => {
    setHover(isHovered);
  }, [isHovered]);
  return (
    <Flex
      alignItems="center"
      width="100%"
      as="form"
      autoComplete="off"
      position="relative"
      {...(boxProps as any)}
      {...bind}
      {...props}
      {...focusWithinProps}
    >
      <Box mr="base" flexGrow={1} position="relative">
        <Flex position="relative" alignItems="center">
          <Search ref={ref} small={small} />
          {query ? (
            <IconButton position="absolute" onClick={clearQuery} right="base" icon={CloseIcon} />
          ) : null}
        </Flex>
        <Flex
          alignItems="center"
          height="100%"
          position="absolute"
          top={0}
          right={isHovered ? '-68px' : '-52px'}
          opacity={isHovered ? 1 : 0}
          transition={transition}
          transitionDelay={isHovered ? '320ms' : '0'}
          pr="base"
          zIndex={9999}
        >
          <Tooltip
            label="Available search terms: principal, tx_id, contract_id, and block_hash."
            placement="bottom"
          >
            <IconButton _hover={{ cursor: 'unset' }} icon={QuestionMarkCircleOutlineIcon} />
          </Tooltip>
        </Flex>
      </Box>
      <SearchResultsCard />
    </Flex>
  );
};
