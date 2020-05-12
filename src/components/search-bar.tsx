import * as React from 'react';
import { forwardRef, Ref } from 'react';
import { Box, Input, Text } from '@blockstack/ui';
import { MagnifyingGlass } from './icons/magnifying-glass';
import { useFocus, useHover } from 'use-events';
import dynamic from 'next/dynamic';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';
import debounce from 'just-debounce-it';
import { SearchBarProps, ErrorType } from '@components/search-bar/types';
import { handleValidation } from '@common/utils';
import { Error } from '@components/search-bar/error';
import Router from 'next/router';

// @ts-ignore
const RecentlyViewed = dynamic(() => import('../components/recently-viewed'), { ssr: false });

export const SearchBar = forwardRef(
  (
    {
      onChange,
      inputOffset = '50px',
      error,
      height,
      clearError,
      value = '',
      small,
      transform,
      ...rest
    }: SearchBarProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <Box position="relative" transform={transform} {...rest}>
        <Box
          position="relative"
          width="100%"
          height={height || '64px'}
          borderRadius="6px"
          bg={small ? 'var(--colors-bg-alt)' : 'var(--colors-bg)'}
        >
          <Text
            as="label"
            // @ts-ignore
            htmlFor="txSearchBar"
            display="block"
            position="absolute"
            opacity={0}
            aria-hidden
            zIndex={-1}
          >
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
            name="txSearchBar"
            pl={inputOffset}
            lineHeight="20px"
            fontSize="inherit"
            position="absolute"
            onChange={onChange}
            backgroundColor="transparent"
            color="var(--colors-text-body)"
            borderColor="var(--colors-border)"
            _placeholder={{ color: 'var(--colors-text-caption)' }}
            placeholder="Enter a transaction ID or contract name."
            _hover={{
              borderColor: 'var(--colors-border)',
            }}
            _focus={{
              boxShadow: error
                ? `0 0 0 3px rgba(212, 0, 26, 0.5)`
                : `0 0 0 3px rgba(170, 179, 255, 0.5)`,
            }}
            boxShadow={
              error ? `0 0 0 3px rgba(212, 0, 26, 0.5)` : `0 0 0 3px rgba(170, 179, 255, 0)`
            }
            ref={ref}
            // @ts-ignore
            autoComplete="off"
          />
          <MagnifyingGlass
            position="absolute"
            zIndex={2}
            top="50%"
            transform="translateY(-50%)"
            left={`calc(${inputOffset} / 2 - 6px)`}
            style={{ pointerEvents: 'none' }}
          />
        </Box>
        <Error small={small} clearError={clearError} error={error} />
      </Box>
    );
  }
);

export const SearchBarWithDropdown: React.FC<Omit<SearchBarProps, 'value'>> = ({
  boxProps = {},
  recentlyViewedProps = {},
  small,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>();
  const [error, setError] = React.useState<ErrorType | undefined>(undefined);
  const [query, setQuery] = React.useState<string>('');
  const [isHovered, hoverBind] = useHover();
  const [isFocused, focusBind] = useFocus();
  const transactions = useRecentlyViewedTx();
  const visible = isHovered || isFocused;

  const hideDropDown = () => {
    inputRef?.current?.blur();
  };

  const clearError = () => {
    setError(undefined);
    setQuery('');
    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    const result = handleValidation(query);
    if (result && !(result as ErrorType).success) {
      setError(result);
      return;
    }
    error && setError(undefined);
    await Router.push(
      {
        pathname: '/txid/[txid]',
        query: { txid: query },
      },
      `/txid/${query}`
    );
    hideDropDown();
  };
  const updateQuery = debounce((v: string) => setQuery(v), 80);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.currentTarget.value || e.currentTarget.value === '') clearError();
    updateQuery(e.currentTarget.value);
  };

  const hideDropdown = small && error?.message;
  return (
    <Box
      position="relative"
      width="100%"
      as="form"
      // @ts-ignore
      autoComplete="off"
      onSubmit={handleOnSubmit}
      {...boxProps}
    >
      <SearchBar
        width="100%"
        onChange={handleSearch}
        clearError={clearError}
        error={error}
        value={query}
        small={small}
        // @ts-ignore
        ref={inputRef}
        {...props}
        {...focusBind}
      />
      <Box
        left={0}
        pt="tight"
        top="100%"
        zIndex={10000}
        position="absolute"
        width="100%"
        style={{ pointerEvents: 'none' }}
        {...hoverBind}
      >
        <RecentlyViewed
          transactions={transactions}
          transition="0.12s all ease-in-out"
          transform={visible ? 'none' : 'translateY(5px)'}
          opacity={!hideDropdown && visible ? 1 : 0}
          style={{
            pointerEvents: visible ? 'all' : 'none',
          }}
        />
      </Box>
    </Box>
  );
};
