'use client';

import { useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { BsChevronDown } from 'react-icons/bs';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { Badge } from '../../../common/components/Badge';
import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import { Section } from '../../../common/components/Section';
import { InfoCircleIcon } from '../../../common/components/icons/info-circle';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useContractById } from '../../../common/queries/useContractById';
import { useAppDispatch } from '../../../common/state/hooks';
import { buildUrl } from '../../../common/utils/buildUrl';
import { MempoolTxListItemMini } from '../../../features/txs-list/ListItem/MempoolTxListItemMini';
import { TxListItemMini } from '../../../features/txs-list/ListItem/TxListItemMini';
import { FilterButton } from '../../../features/txsFilterAndSort/FilterButton';
import { AllTransactionsFilteredMessage } from '../../../features/txsFilterAndSort/TransactionMessages';
import { useFilterAndSortState } from '../../../features/txsFilterAndSort/useFilterAndSortState';
import { Accordion } from '../../../ui/Accordion';
import { AccordionButton } from '../../../ui/AccordionButton';
import { AccordionIcon } from '../../../ui/AccordionIcon';
import { AccordionItem } from '../../../ui/AccordionItem';
import { AccordionPanel } from '../../../ui/AccordionPanel';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { IconButton } from '../../../ui/IconButton';
import { Stack } from '../../../ui/Stack';
import { FunctionIcon } from '../../../ui/icons';
import { Caption, Text, Title } from '../../../ui/typography';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
import { useUser } from '../hooks/useUser';
import { setCodeBody, toggleRightPanel } from '../sandbox-slice';

const LoadButton = ({ codeBody }: { codeBody: string }) => {
  const router = useRouter();
  const network = useGlobalContext().activeNetwork;
  const [loaded, setLoaded] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const dispatch = useAppDispatch();
  const colorMode = useColorMode().colorMode;
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
};

const TxDetailsFunctions = ({
  hasFunctionsAvailable,
  contractInterface,
  contractId,
  status,
}: any) => {
  const [fnsVisible, setFnsVisibility] = React.useState(false);
  const dispatch = useAppDispatch();
  const colorMode = useColorMode().colorMode;

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
        <Caption fontWeight="500">Call contract</Caption>
        <HStack gap={2} alignItems="center">
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
              <BsChevronDown size={'16px'} transform={!fnsVisible ? 'none' : 'rotate(180deg)'} />
            }
            aria-label={'toggle function'}
          />
        </HStack>
      </Flex>
      {fnsVisible ? (
        <Stack maxHeight="120px" overflowX="auto">
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
                  <Caption ml="4px">{func.name}</Caption>
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
};

function TxDetailsBase({ tx }: { tx: Transaction }) {
  const contractId =
    tx.tx_type === 'smart_contract'
      ? tx.smart_contract.contract_id
      : tx.tx_type === 'contract_call'
        ? tx.contract_call.contract_id
        : undefined;

  const { data: contract } = useContractById(contractId);

  const hasFunctionsAvailable =
    tx.tx_type === 'smart_contract' &&
    tx.tx_status === 'success' &&
    !!contract?.abi?.functions?.length;

  if (!contract)
    return (
      <Text fontSize={'14px'} p={'20px'} align={'center'}>
        Nothing to show
      </Text>
    );

  return (
    <>
      <Box>
        <Box>
          <Flex
            justifyContent="space-between"
            borderWidth={hasFunctionsAvailable ? '1px' : undefined}
            px="16px"
            py="8px"
            alignItems="center"
          >
            <Caption fontWeight="500">Redeploy contract</Caption>
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
    </>
  );
}

function TxDetails({ tx }: { tx: Transaction }) {
  return (
    <ExplorerErrorBoundary>
      <TxDetailsBase tx={tx} />
    </ExplorerErrorBoundary>
  );
}

export function TransactionsPanel() {
  const { txs, mempoolTransactions } = useUser();
  const { activeFilters } = useFilterAndSortState();

  const filteredTxs = useMemo(
    () => (!activeFilters.length ? txs : txs?.filter(tx => activeFilters.includes(tx.tx_type))),
    [txs, activeFilters]
  );

  const hasTxButIsFiltered = txs?.length && filteredTxs?.length === 0;

  const pendingList = React.useMemo(
    () =>
      mempoolTransactions?.map(tx => (
        <Flex>
          <MempoolTxListItemMini key={tx.tx_id} tx={tx} />
        </Flex>
      )),
    [mempoolTransactions]
  );

  const txList = React.useMemo(
    () =>
      filteredTxs.map(tx => (
        <AccordionItem key={tx.tx_id} border={'none'}>
          <Flex gap={'6px'}>
            <TxListItemMini tx={tx} />
            <AccordionButton
              flexGrow={0}
              flexShrink={0}
              width={'30px'}
              ml={'auto'}
              p={0}
              justifyContent={'center'}
            >
              <AccordionIcon />
            </AccordionButton>
          </Flex>
          <AccordionPanel borderTopWidth="1px">
            <TxDetails tx={tx} />
          </AccordionPanel>
        </AccordionItem>
      )),
    [filteredTxs]
  );

  return (
    <Section title={'Transactions'} topRight={<FilterButton />}>
      {pendingList}
      {filteredTxs?.length ? (
        <Accordion allowMultiple>{txList}</Accordion>
      ) : hasTxButIsFiltered ? (
        <AllTransactionsFilteredMessage />
      ) : (
        <Flex flexGrow={1} flexDirection="column" alignItems="center" justifyContent="center">
          <Stack textAlign="center">
            <Title>No Transactions</Title>
            <Caption>Your list of transactions will display here.</Caption>
          </Stack>
        </Flex>
      )}
    </Section>
  );
}
