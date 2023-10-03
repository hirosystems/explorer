import { TbSearch } from 'react-icons/tb';
import { useColorMode } from '@chakra-ui/react';
import { ReactNode } from 'react';
import {
  Grid,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@/ui/components';
import { Section } from '@/components/section';
import { TokenRow } from '@/appPages/tokens/TokenRow';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Text } from '@/ui/Text';
import { useTokens } from '@/appPages/tokens/useTokens';
import { Loading } from './loading';

export function TokensList(props: { children?: ReactNode }) {
  const { colorMode } = useColorMode();
  const { searchTerm, setSearchTerm, allFtTokensDeduped, isLoading, hasMore, loadMore } =
    useTokens();

  if (isLoading) return <Loading />;

  return (
    <Section
      title="Tokens"
      gridColumnStart={['1', '1', '2']}
      gridColumnEnd={['2', '2', '3']}
      minWidth={0}
      topRight={
        <InputGroup>
          <InputRightElement pointerEvents="none">
            <Icon as={TbSearch} color={`textCaption.${colorMode}`} />
          </InputRightElement>
          <Input
            type="text"
            placeholder="Token name, symbol or address"
            _placeholder={{ color: `textCaption.${colorMode}` }}
            width={['200px', '300px']}
            paddingRight="35px"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      }
    >
      {allFtTokensDeduped.length ? (
        <TableContainer>
          <Table variant="simple" overflowX="auto" __css={{ tableLayout: 'fixed', width: 'full' }}>
            <Thead>
              <Tr>
                <Th padding="10px 20px 10px 16px" width={['auto', 'auto', '30%']}>
                  Token
                </Th>
                <Th padding="10px" display={['none', 'none', 'table-cell']}>
                  Tx ID
                </Th>
                <Th isNumeric width="130px" padding="10px 16px 10px 20px">
                  Total supply
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {allFtTokensDeduped.map(
                (ftToken, i) =>
                  !!ftToken.name && (
                    <TokenRow
                      key={ftToken.tx_id}
                      name={ftToken.name}
                      txId={ftToken.tx_id}
                      symbol={ftToken.symbol}
                      totalSupply={ftToken.total_supply}
                      imgUrl={ftToken.image_uri}
                      tokenId={(ftToken as any).contract_principal}
                    />
                  )
              )}
            </Tbody>
          </Table>
          <SectionFooterAction
            isLoading={isLoading}
            hasNextPage={hasMore}
            fetchNextPage={loadMore}
            label="tokens"
          />
        </TableContainer>
      ) : (
        <Grid placeItems="center" px="16px" py="32px" width="100%">
          <Text color="textCaption" mt="32px">
            No tokens found
          </Text>
        </Grid>
      )}
    </Section>
  );
}
