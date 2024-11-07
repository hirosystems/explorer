import { Box, Flex } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Section } from '../../../common/components/Section';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import {
  advancedSearchConfig,
  filterToFormattedValueMap,
  getKeywordByFilter,
  parseAdvancedSearchQuery,
  useSearchPageUrl,
  useSearchQuery,
} from '../../../common/queries/useSearchQuery';
import { useAppSelector } from '../../../common/state/hooks';
import { Network } from '../../../common/types/network';
import { SearchResultType } from '../../../common/types/search-results';
import { buildUrl } from '../../../common/utils/buildUrl';
import { ButtonLink } from '../../../ui/ButtonLink';
import { Text } from '../../../ui/Text';
import { NoTxs } from '../NoTxs';
import { SearchResultItem } from '../items/search-result-item';
import { selectIsSearchFieldFocused, selectSearchTerm } from '../search-slice';
import { SearchSkeleton } from './SearchSkeleton';

function SearchResultHeader({
  advancedSearchQuery,
  searchTerm,
}: {
  advancedSearchQuery: ReturnType<typeof parseAdvancedSearchQuery>;
  searchTerm: string;
}) {
  const isAdvancedSearch = Object.keys(advancedSearchQuery).length > 0;
  if (!!searchTerm) {
    if (isAdvancedSearch) {
      return (
        <Flex rowGap={2} columnGap={2.5} flexWrap={'wrap'} alignItems={'center'}>
          <Text fontSize={'xs'} color="textSubdued">
            Search results for:
          </Text>
          {advancedSearchQuery.map(({ filterName, filterValue }) => {
            const keyword = getKeywordByFilter(filterName);
            const value =
              filterValue && filterToFormattedValueMap[filterName]
                ? filterToFormattedValueMap[filterName](filterValue)
                : filterValue || '';
            return (
              <Text key={filterName} fontSize={'xs'} color="textSubdued">
                {!!keyword && (
                  <Text
                    display="inline-block"
                    bg="surfaceHighlight"
                    borderRadius="md"
                    py={1.5}
                    whiteSpace="pre"
                    textTransform={'uppercase'}
                  >
                    {' '}
                    {getKeywordByFilter(filterName)}{' '}
                  </Text>
                )}{' '}
                {value}
              </Text>
            );
          })}
        </Flex>
      );
    } else {
      return (
        <Text fontSize={'xs'} color="textSubdued">
          Search results for: {searchTerm}
        </Text>
      );
    }
  } else {
    return (
      <>
        <Text fontSize={'xs'} color="textSubdued">
          Tip: filter your search by using keywords.
        </Text>
        <Flex rowGap={2} columnGap={2.5} flexWrap={'wrap'}>
          {Object.keys(advancedSearchConfig).map(key => {
            //skip term
            if (key === 'TERM:') return null;
            return (
              <Text key={key} fontSize={'xs'}>
                <Text
                  display="inline-block"
                  bg="surfaceHighlight"
                  borderRadius="md"
                  color="textSubdued"
                  py={1.5}
                  whiteSpace="pre"
                  textTransform={'uppercase'}
                >
                  {' '}
                  {key} ({advancedSearchConfig[key].type}){' '}
                </Text>
              </Text>
            );
          })}
        </Flex>
      </>
    );
  }
}

function getSearchEntityUrl(
  activeNetwork: Network,
  result?: ReturnType<typeof useSearchQuery>['data']
) {
  if (!result || !result.found || result.result.entity_type === SearchResultType.TxList) {
    return;
  }
  switch (result.result.entity_type) {
    case SearchResultType.BlockHash:
      return buildUrl(`/block/${encodeURIComponent(result.result.entity_id)}`, activeNetwork);
    case SearchResultType.ContractAddress:
    case SearchResultType.MempoolTxId:
    case SearchResultType.TxId:
      return buildUrl(`/txid/${encodeURIComponent(result.result.entity_id)}`, activeNetwork);
    case SearchResultType.StandardAddress:
      return buildUrl(`/address/${encodeURIComponent(result.result.entity_id)}`, activeNetwork);
  }
}

export function SearchResultsCard({
  searchResponse,
}: {
  searchResponse: ReturnType<typeof useSearchQuery>;
}) {
  const { data, isLoading, error } = searchResponse;
  const searchTerm = useAppSelector(selectSearchTerm);
  const isFocused = useAppSelector(selectIsSearchFieldFocused);
  const hasError = !!error || !!(data && !data?.found);
  const hasResults = !hasError && !!data?.found;
  const advancedSearchQuery = parseAdvancedSearchQuery(searchTerm);
  const isAdvancedSearch = Object.keys(advancedSearchQuery).length > 0;
  const network = useGlobalContext().activeNetwork;
  const searchPageUrl = useSearchPageUrl(searchTerm, network);
  const router = useRouter();
  const activeNetwork = useGlobalContext().activeNetwork;

  useEffect(() => {
    const entityUrl = getSearchEntityUrl(activeNetwork, data);
    if (entityUrl) {
      router.push(entityUrl);
    }
  }, [activeNetwork, data, router]);

  const isSearchPage = usePathname() === '/search';

  if (!isFocused || isSearchPage) return null;

  const totalCount = data && 'metadata' in data.result ? data?.result?.metadata?.totalCount : 0;

  return (
    <Section
      position={'absolute'}
      zIndex={'docked'}
      mt={4}
      width={'768px'}
      maxWidth={'full'}
      left={0}
    >
      <Flex
        direction={'column'}
        gap={3}
        py={4}
        px={6}
        borderBottom={hasResults || hasError ? '1px' : undefined}
        mx={-6}
      >
        <SearchResultHeader advancedSearchQuery={advancedSearchQuery} searchTerm={searchTerm} />
      </Flex>
      <Box>
        {!searchTerm ? null : isLoading ? (
          <SearchSkeleton />
        ) : data?.found ? (
          <Box py={!isAdvancedSearch ? 6 : 0}>
            <SearchResultItem result={data} />
          </Box>
        ) : (
          <NoTxs />
        )}
      </Box>
      {totalCount > 5 && (
        <ButtonLink
          buttonProps={{ variant: 'secondary', width: 'full' }}
          linkProps={{ href: searchPageUrl }}
          mb={6}
        >
          View {totalCount} results
        </ButtonLink>
      )}
    </Section>
  );
}
