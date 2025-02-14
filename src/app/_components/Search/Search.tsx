import { Box, Flex, HStack, Icon, Stack } from '@chakra-ui/react';
import { ArrowRight, Command, Info, KeyReturn, MagnifyingGlass, X } from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { ReactNode, useCallback } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import {
  advancedSearchConfig,
  advancedSearchKeywords,
  useSearchPageUrl,
} from '../../../common/queries/useSearchQuery';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import {
  blur,
  clearSearchTerm,
  focus,
  selectIsSearchFieldFocused,
  selectSearchPreviewScrollLeft,
  selectTempSearchTerm,
  setSearchPreviewScrollLeft,
  setSearchTerm,
  setTempSearchTerm,
} from '../../../features/search/search-slice';
import { Button } from '../../../ui/Button';
import { Input, InputProps } from '../../../ui/Input';
import { Kbd } from '../../../ui/Kbd';
import { Text } from '../../../ui/Text';
import { DoubleGradientBorderWrapper } from './DoubleGradientBorderWrapper';
import {
  BlockResultItem,
  BnsResultItem,
  CoinbaseResultItem,
  ContractCallResultItem,
  ContractDeployResultItem,
  ResultItem,
  TenureChangeResultItem,
  TokenTransferResultItem,
} from './ResultItem';
import { SearchLink } from './SearchLink';

export function SearchResultsWrapper({ children }: { children: ReactNode }) {
  return (
    <Stack
      zIndex={-1}
      position={'absolute'}
      background={'surfaceSecondary'}
      left={-3}
      right={-3}
      top={-3}
      borderRadius={'redesign.xxl'}
      boxShadow={'var(--stacks-shadows-elevation3)'}
      gap={4}
    >
      {children}
    </Stack>
  );
}

function KeywordsPreview() {
  return (
    <Flex rowGap={1} columnGap={2} flexWrap={'wrap'} mt={1}>
      {Object.keys(advancedSearchConfig).map(key => {
        if (key === 'TERM:') return null;
        return (
          <Flex
            key={key}
            fontSize={'xs'}
            borderRadius="redesign.md"
            whiteSpace="pre"
            textTransform={'uppercase'}
            fontFamily="var(--font-matter-mono)"
            fontWeight={'400'}
          >
            <Text color={'textSecondary'}>{key}</Text>
            <Text color={'textTertiary'}>({advancedSearchConfig[key].type})</Text>
          </Flex>
        );
      })}
    </Flex>
  );
}

function DocsLink() {
  return (
    <SearchLink
      width={'fit-content'}
      lineHeight={'base'}
      textDecoration={'none'}
      color={'textSecondary'}
      fontSize={'xs'}
      borderBottom={'1px solid'}
      _hover={{
        color: 'textInteractiveHover',
      }}
    >
      Learn more about search syntax
    </SearchLink>
  );
}

function QuickLinkButton({ children }: { children: ReactNode }) {
  return (
    <Button variant={'redesignTertiary'} size={'small'}>
      {children}
      <Icon w={3.5} h={3.5}>
        <ArrowRight />
      </Icon>
    </Button>
  );
}

function QuickLinks() {
  return (
    <Stack
      backgroundColor={'surfacePrimary'}
      p={4}
      fontFamily="var(--font-instrument-sans)"
      gap={2}
      borderBottomLeftRadius={4.5}
      borderBottomRightRadius={4.5}
    >
      <Text fontSize={'xs'} color={'textSecondary'} lineHeight={'base'}>
        Quick links
      </Text>
      <Flex gap={2}>
        <QuickLinkButton>sBTC</QuickLinkButton>
        <QuickLinkButton>Blocks</QuickLinkButton>
        <QuickLinkButton>Mempool</QuickLinkButton>
        <QuickLinkButton>Stacking</QuickLinkButton>
        <QuickLinkButton>Transactions</QuickLinkButton>
      </Flex>
    </Stack>
  );
}

type RecentResult =
  | Transaction
  | MempoolTransaction
  | { bns: string; address: string }
  | { height: number; hash: string }
  | string;

function RecentResults({ recentResults }: { recentResults: RecentResult[] }) {
  return (
    <Stack px={4} fontFamily="var(--font-instrument-sans)" gap={2}>
      <Text fontSize={'xs'} color={'textSecondary'} lineHeight={'base'}>
        Recent results
      </Text>
      <Stack gap={1}>
        {recentResults.map((recentResultItem, index) => {
          if (typeof recentResultItem === 'string') {
            return <ResultItem key={index} value={recentResultItem} />;
          }
          if ('bns' in recentResultItem) {
            return (
              <BnsResultItem
                key={index}
                bns={recentResultItem.bns}
                address={recentResultItem.address}
              />
            );
          }
          if ('height' in recentResultItem) {
            return (
              <BlockResultItem
                key={index}
                height={recentResultItem.height}
                hash={recentResultItem.hash}
              />
            );
          }
          if ('tx_type' in recentResultItem && recentResultItem.tx_type === 'token_transfer') {
            return <TokenTransferResultItem key={index} tx={recentResultItem} />;
          }
          if ('tx_type' in recentResultItem && recentResultItem.tx_type === 'contract_call') {
            return <ContractCallResultItem key={index} tx={recentResultItem} />;
          }
          if ('tx_type' in recentResultItem && recentResultItem.tx_type === 'smart_contract') {
            return <ContractDeployResultItem key={index} tx={recentResultItem} />;
          }
          if ('tx_type' in recentResultItem && recentResultItem.tx_type === 'coinbase') {
            return <CoinbaseResultItem key={index} tx={recentResultItem} />;
          }
          if ('tx_type' in recentResultItem && recentResultItem.tx_type === 'tenure_change') {
            return <TenureChangeResultItem key={index} tx={recentResultItem} />;
          }
          return null;
        })}
      </Stack>
    </Stack>
  );
}

function HiddenSearchField(props: InputProps) {
  const dispatch = useAppDispatch();
  return (
    <Input
      id="search-bar"
      name="search-bar"
      display="block"
      type="search"
      autoComplete="off"
      autoCapitalize={'off'}
      autoCorrect={'off'}
      enterKeyHint={'search'}
      outline={'none'}
      border={'none'}
      fontSize="sm"
      color="transparent"
      bg={'transparent'}
      p={0}
      zIndex="docked"
      width={'full'}
      css={{
        caretColor: 'textPrimary',
        '::-webkit-search-cancel-button': {
          display: 'none',
        },
      }}
      _placeholder={{ color: 'textSecondary' }}
      _hover={{
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      }}
      _focus={{
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      }}
      onFocus={() => dispatch(focus())}
      onBlur={() => setTimeout(() => dispatch(blur()), 200)}
      {...props}
    />
  );
}

function StartElement() {
  return (
    <Flex
      background={'surfaceSecondary'}
      pl={4}
      pr={3}
      zIndex={1}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Icon className={'search-icon'} h={4} w={4} color={'iconSecondary'}>
        <MagnifyingGlass />
      </Icon>
    </Flex>
  );
}

function EndElement({ handleSearch }: { handleSearch: () => void }) {
  const dispatch = useAppDispatch();
  const isSearchFieldFocused = useAppSelector(selectIsSearchFieldFocused);
  const tempSearchTerm = useAppSelector(selectTempSearchTerm);
  return (
    <Flex
      alignItems={'center'}
      background={'surfaceSecondary'}
      px={2}
      zIndex={1}
      gap={1.5}
      height={5.5}
    >
      {isSearchFieldFocused ? (
        !!tempSearchTerm ? (
          <>
            <Kbd onClick={handleSearch} cursor={'pointer'}>
              <Icon h={3.5} w={3.5} color={'iconSecondary'}>
                <KeyReturn />
              </Icon>
            </Kbd>
            <Icon
              h={3.5}
              w={3.5}
              color={'iconSecondary'}
              cursor={'pointer'}
              onClick={() => dispatch(clearSearchTerm())}
            >
              <X />
            </Icon>
          </>
        ) : null
      ) : (
        <Kbd>
          <Icon h={3.5} w={3}>
            <Command />
          </Icon>
          <Text fontSize={'xs'} fontFamily="var(--font-matter-mono)">
            K
          </Text>
        </Kbd>
      )}
    </Flex>
  );
}

function SearchPreview() {
  const scrollLeft = useAppSelector(selectSearchPreviewScrollLeft);
  const tempSearchTerm = useAppSelector(selectTempSearchTerm);
  return (
    <Flex
      fontSize="sm"
      lineHeight="none"
      position="absolute"
      alignItems="center"
      whiteSpace="pre"
      overflow="hidden"
      textOverflow="ellipsis"
      width={'fit-content'}
      justifyContent={'flex-start'}
      style={{ transform: `translateX(-${scrollLeft}px)` }}
      height={'full'}
      color={'textPrimary'}
    >
      {tempSearchTerm
        ?.toString()
        ?.split(new RegExp(`(${advancedSearchKeywords.join('|')})`, 'g'))
        ?.map((segment, index) =>
          advancedSearchKeywords.includes(segment) ? (
            <Text
              key={index}
              display="inline-block"
              bg={{ base: 'feedback.blue-200', _dark: 'feedback.blue-900' }}
              color={{ base: 'feedback.blue-600', _dark: 'feedback.blue-300' }}
              borderRadius="redesign.xs"
              py={1}
              whiteSpace="pre"
              textTransform={'uppercase'}
            >
              {segment}
            </Text>
          ) : (
            <React.Fragment key={index}>{segment}</React.Fragment>
          )
        )}
    </Flex>
  );
}

function SearchInput() {
  const dispatch = useAppDispatch();
  const tempSearchTerm = useAppSelector(selectTempSearchTerm);
  const reg = new RegExp(`(${advancedSearchKeywords.join('|')})`, 'gi');
  const isSearchFieldFocused = useAppSelector(selectIsSearchFieldFocused);
  const router = useRouter();
  const isSearchPage = usePathname() === '/search';
  const network = useGlobalContext().activeNetwork;
  const searchPageUrl = useSearchPageUrl(tempSearchTerm, network);
  const isAdvancedSearch = advancedSearchKeywords.some(term => tempSearchTerm.includes(term));

  const handleSearch = useCallback(() => {
    if (isSearchPage && isAdvancedSearch) {
      router.push(searchPageUrl);
    } else {
      dispatch(setSearchTerm(tempSearchTerm));
    }
  }, [dispatch, isAdvancedSearch, isSearchPage, router, searchPageUrl, tempSearchTerm]);

  return (
    <DoubleGradientBorderWrapper>
      <Flex
        background={'surfaceSecondary'}
        alignItems={'center'}
        width={'full'}
        overflow="hidden"
        position="relative"
        borderRadius="redesign.lg"
        zIndex={3}
      >
        <StartElement />
        <Flex width={'full'} fontFamily="var(--font-instrument-sans)">
          <HiddenSearchField
            placeholder={isSearchFieldFocused ? '' : 'Explore'}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const formattedValue = e.currentTarget.value.replace(reg, match => {
                return match.toUpperCase();
              });
              dispatch(setTempSearchTerm(formattedValue.trimStart()));
            }}
            onScroll={(e: React.FormEvent<HTMLInputElement>) =>
              dispatch(setSearchPreviewScrollLeft(e.currentTarget.scrollLeft))
            }
            value={tempSearchTerm}
          />
          <SearchPreview />
        </Flex>
        <EndElement handleSearch={handleSearch} />
      </Flex>
    </DoubleGradientBorderWrapper>
  );
}

export function Search({
  searchTermFromQueryParams = '',
  recentResults = [],
}: {
  searchTermFromQueryParams?: string;
  recentResults: RecentResult[];
}) {
  const isSearchFieldFocused = useAppSelector(selectIsSearchFieldFocused);

  return (
    <HStack width="full" position={'relative'} zIndex={1}>
      <SearchInput />
      {isSearchFieldFocused && (
        <SearchResultsWrapper>
          <Stack gap={6}>
            <Stack px={4} gap={3} pt={16}>
              <KeywordsPreview />
              <DocsLink />
            </Stack>
            <RecentResults recentResults={recentResults} />
          </Stack>
          <QuickLinks />
        </SearchResultsWrapper>
      )}
    </HStack>
  );
}
