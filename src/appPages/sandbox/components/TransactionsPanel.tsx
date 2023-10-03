import { useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { memo, useMemo, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { buildUrl } from '@/appPages/common/utils/buildUrl';
import { Badge } from '@/common/components/Badge';
import { useGlobalContext } from '@/common/context/useAppContext';
import { useAppDispatch } from '@/common/state/hooks';
import { FilteredMessage, FilterPanel } from '@/components/filter-panel';
import { InfoCircleIcon } from '@/components/icons/info-circle';
import { ExplorerLink } from '@/components/links';
import { transactionQK, TransactionQueryKeys } from '@/features/transaction/query-keys';
import { useTransactionQueries } from '@/features/transaction/use-transaction-queries';
import { Accordion } from '@/ui/Accordion';
import { AccordionButton } from '@/ui/AccordionButton';
import { AccordionIcon } from '@/ui/AccordionIcon';
import { AccordionItem } from '@/ui/AccordionItem';
import { AccordionPanel } from '@/ui/AccordionPanel';
import { Box, Flex, Icon, IconButton, Stack } from '@/ui/components';
import { FunctionIcon } from '@/ui/icons';
import { Caption, Text, Title } from '@/ui/typography';

import { MempoolTxListItemMini } from '../../common/components/tx-lists/list-items/MempoolTxListItemMini';
import { TxListItemMini } from '../../common/components/tx-lists/list-items/TxListItemMini';
import { useFilterState } from '../../common/hooks/use-filter-state';
import { useVerticallyStackedElementsBorderStyle } from '../../common/styles/border';
import { setCodeBody, toggleRightPanel } from '../sandbox-slice';

function PanelHeader() {
  const { toggleFilterVisibility } = useFilterState();
  return (
    <Flex
      justifyContent="space-between"
      px="16px"
      borderBottomWidth="1px"
      py="8px"
      bg={`bg.${useColorMode().colorMode}`}
    >
      <Caption>Transactions</Caption>

      <Caption
        display="flex"
        alignItems="center"
        _hover={{ cursor: 'pointer', color: 'textTitle' }}
        onClick={toggleFilterVisibility}
        gap="4px"
      >
        <Icon as={FiFilter} color="currentColor" />
        Filter transactions
      </Caption>
    </Flex>
  );
}

function LoadButton({ codeBody }: { codeBody: string }) {
  const router = useRouter();
  const network = useGlobalContext().activeNetwork;
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  return loaded ? (
    <Badge userSelect="none" color={`textCaption.${colorMode}`}>
      Loaded!
    </Badge>
  ) : !clicked ? (
    <Badge
      userSelect="none"
      _hover={{ cursor: 'pointer', color: `textTitle.${colorMode}` }}
      color={`textCaption.${colorMode}`}
      onClick={() => setClicked(true)}
    >
      Load in editor
    </Badge>
  ) : (
    <Badge userSelect="none" color={`textCaption.${colorMode}`}>
      <Flex>
        <Box
          _hover={{ cursor: 'pointer', color: `textTitle.${colorMode}` }}
          pr="8px"
          onClick={() => setClicked(false)}
        >
          Cancel
        </Box>
        <Box
          _hover={{ cursor: 'pointer', color: `textTitle.${colorMode}` }}
          pl="8px"
          borderWidth="1px"
          onClick={() => {
            setClicked(false);
            dispatch(setCodeBody({ codeBody }));
            setLoaded(true);
            void router.push(buildUrl('/sandbox/deploy', network));
            setTimeout(() => {
              setLoaded(false);
            }, 3000);
          }}
        >
          Confirm
        </Box>
      </Flex>
    </Badge>
  );
}

function TxDetailsFunctions({ hasFunctionsAvailable, contractInterface, contractId, status }: any) {
  const [fnsVisible, setFnsVisibility] = useState(false);
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();

  return hasFunctionsAvailable ? (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth={fnsVisible ? '1px' : undefined}
        px="16px"
        pb="8px"
        pt="12px"
      >
        <Caption fontWeight="500" color="textBody">
          Call contract
        </Caption>
        <Stack isInline spacing="8px" alignItems="center">
          <ExplorerLink href={`/sandbox/contract-call/${contractId}`}>
            <Badge
              userSelect="none"
              _hover={{
                cursor: 'pointer',
                color: `textTitle.${colorMode}`,
              }}
              color={`textCaption.${colorMode}`}
            >
              Load contract
            </Badge>
          </ExplorerLink>
          <IconButton
            size="24px"
            onClick={() => {
              setFnsVisibility(s => !s);
            }}
            icon={
              <BsChevronDown size="16px" transform={!fnsVisible ? undefined : 'rotate(180deg)'} />
            }
            aria-label="toggle function"
          />
        </Stack>
      </Flex>
      {fnsVisible ? (
        <Stack maxHeight="120px" overflowX="auto" spacing="0">
          {contractInterface?.abi?.functions?.map((func: any, index: number, arr: any[]) => {
            return func.access !== 'private' ? (
              <Flex
                borderBottomWidth={index === arr.length - 1 ? undefined : '1px'}
                px="16px"
                py="8px"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" color={`textCaption.${colorMode}`}>
                  {func.access === 'read_only' ? (
                    <InfoCircleIcon size="18px" />
                  ) : (
                    <FunctionIcon size="18px" />
                  )}
                  <Caption color={`textBody.${colorMode}`} ml="4px">
                    {func.name}
                  </Caption>
                </Flex>
                {status === 'success' ? (
                  <ExplorerLink href={`/sandbox/contract-call/${contractId}/${func.name}`}>
                    <Badge
                      _hover={{ color: `textTitle.${colorMode}`, cursor: 'pointer' }}
                      color={`textCaption.${colorMode}`}
                      onClick={() => {
                        dispatch(toggleRightPanel());
                      }}
                    >
                      Load function
                    </Badge>
                  </ExplorerLink>
                ) : null}
              </Flex>
            ) : null;
          })}
        </Stack>
      ) : null}
    </>
  ) : null;
}

const TxDetails = memo(({ tx }: { tx: Transaction }) => {
  const contractId =
    tx.tx_type === 'smart_contract'
      ? tx.smart_contract.contract_id
      : tx.tx_type === 'contract_call'
      ? tx.contract_call.contract_id
      : '';
  const queries = useTransactionQueries();
  const { colorMode } = useColorMode();

  const { data: contract } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId),
    { staleTime: Infinity, enabled: !!contractId }
  );

  const hasFunctionsAvailable =
    tx.tx_type === 'smart_contract' &&
    tx.tx_status === 'success' &&
    !!contract?.abi?.functions?.length;

  if (!contract)
    return (
      <Text fontSize="14px" p="20px" align="center">
        Nothing to show
      </Text>
    );

  return (
    <Box>
      <Box>
        <Flex
          justifyContent="space-between"
          borderWidth={hasFunctionsAvailable ? '1px' : undefined}
          px="16px"
          py="8px"
          alignItems="center"
        >
          <Caption fontWeight="500" color={`textBody.${colorMode}`}>
            Redeploy contract
          </Caption>
          <LoadButton codeBody={contract.source_code} />
        </Flex>
        <TxDetailsFunctions
          contractId={contractId}
          status={tx.tx_status}
          hasFunctionsAvailable={hasFunctionsAvailable}
          contractInterface={contract}
        />
      </Box>
    </Box>
  );
});

export const TransactionsPanel = memo(
  ({
    transactions,
    mempoolTransactions,
    stxAddress,
  }: {
    transactions: Transaction[];
    mempoolTransactions: MempoolTransaction[];
    stxAddress: string;
  }) => {
    const { activeFilters } = useFilterState();

    const filteredTxs = (transactions || []).filter(tx => activeFilters[tx.tx_type]);
    const hasTxButIsFiltered = transactions?.length && filteredTxs?.length === 0;

    const pendingList = useMemo(
      () =>
        mempoolTransactions?.map(tx => (
          <Flex>
            <MempoolTxListItemMini key={tx.tx_id} tx={tx} />
          </Flex>
        )),
      [mempoolTransactions]
    );

    const txList = useMemo(
      () =>
        filteredTxs.map(tx => (
          <AccordionItem key={tx.tx_id} border="none">
            <Flex gap="6px">
              <TxListItemMini tx={tx} />
              <AccordionButton
                flexGrow={0}
                flexShrink={0}
                width="30px"
                ml="auto"
                p={0}
                justifyContent="center"
              >
                <AccordionIcon />
              </AccordionButton>
            </Flex>
            <AccordionPanel css={useVerticallyStackedElementsBorderStyle} borderTopWidth="1px">
              <TxDetails tx={tx} />
            </AccordionPanel>
          </AccordionItem>
        )),
      [filteredTxs]
    );

    return (
      <Flex
        position="relative"
        flexDirection="column"
        flexGrow={1}
        bg={`bgAlt.${useColorMode().colorMode}`}
        borderBottomRightRadius="12px"
        overflow="hidden"
      >
        <PanelHeader />
        <FilterPanel />
        <Flex
          flexDirection="column"
          flexGrow={1}
          overflow="auto"
          bg={`bg.${useColorMode().colorMode}`}
          position="relative"
          pl="20px"
          css={useVerticallyStackedElementsBorderStyle}
        >
          <>
            {pendingList}
            {filteredTxs?.length ? (
              <Accordion allowMultiple>{txList}</Accordion>
            ) : hasTxButIsFiltered ? (
              <FilteredMessage />
            ) : (
              <Flex flexGrow={1} flexDirection="column" alignItems="center" justifyContent="center">
                <Stack textAlign="center">
                  <Title>No Transactions</Title>
                  <Caption>Your list of transactions will display here.</Caption>
                </Stack>
              </Flex>
            )}
          </>
        </Flex>
      </Flex>
    );
  }
);
