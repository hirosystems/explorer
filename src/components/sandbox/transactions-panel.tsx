// @ts-nocheck
import React from 'react';
import { Box, Flex, Stack, color, Grid, transition, FlexProps } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';
import { border } from '@common/utils';
import { useUser } from '@common/hooks/use-user';
import { TxItem } from '@components/transaction-item';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ContractInterfaceFunction } from '@blockstack/rpc-client';
import {
  contractCallViewState,
  contractSearchQueryState,
  currentFunctionState,
  tabState,
  txContractState,
  txDetailsState,
} from '@components/sandbox/state/atoms';
import { IconButton } from '@components/icon-button';
import { ChevronDown } from '@components/icons/chevron-down';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';
import { useApiServer } from '@common/hooks/use-api';
import { Pending } from '@components/status';
import { Badge } from '@components/badge';
import { useCodeEditor } from '@components/code-editor/code-editor';
import { useClarityRepl } from '@common/hooks/use-clarity-repl';
import { ContractCallIcon } from '@components/icons/contract-call';
import { InfoCircleIcon } from '@components/icons/info-circle';
import { ExternalLinkIcon } from '@components/icons/external-link';
import { TxLink } from '@components/links';
import CheckboxBlankCircleOutlineIcon from 'mdi-react/CheckboxBlankCircleOutlineIcon';
import { Tag } from '@components/tags';
import { TransactionType } from '@models/transaction.interface';

import { blue, focusBlue } from '@components/button';
import CloseIcon from 'mdi-react/CloseIcon';
import { useHover } from 'use-events';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import { FilterIcon } from '@components/icons/filter';

import FilterVariantIcon from 'mdi-react/FilterVariantIcon';

const types = [
  TransactionType.SMART_CONTRACT,
  TransactionType.CONTRACT_CALL,
  TransactionType.TOKEN_TRANSFER,
];

const filterState = atom({
  key: 'sandbox.tx-panel.filter',
  default: {
    showing: false,
    types: types,
    showPending: true,
    showFailed: true,
  },
});

const Toggle: React.FC<{ label: string; value: boolean } & FlexProps> = ({
  label,
  onClick,
  value,
  ...rest
}) => {
  const toggled = value;
  const handleClick = () => {
    onClick?.();
  };
  return (
    <Flex
      _hover={{
        cursor: 'pointer',
      }}
      _focus={{
        dropShadow: `0 0 0 3px ${focusBlue(0.5)}`,
      }}
      justifyContent="flex-end"
      onClick={handleClick}
      {...rest}
    >
      <Caption
        _hover={{
          cursor: 'pointer',
        }}
        fontWeight="500"
        color={color('text-body')}
        mr="tight"
        as="label"
      >
        {label}
      </Caption>
      <Flex
        px="4px"
        alignItems="center"
        width="36px"
        borderRadius="24px"
        height="20px"
        transition={transition}
        position="relative"
      >
        <Box
          transform={toggled ? 'translateX(14px)' : 'none'}
          transition={transition}
          bg={color('bg')}
          size="14px"
          borderRadius="100%"
          position="relative"
          zIndex={2}
        />
        <Box
          opacity={toggled ? 1 : 0.5}
          left={0}
          top={0}
          borderRadius="24px"
          position="absolute"
          size="100%"
          bg={toggled ? blue() : color('text-caption')}
          zIndex={1}
        />
      </Flex>
    </Flex>
  );
};

const CheckableElement = ({ type, value: toggled, onClick, ...rest }) => {
  const [isHovered, bind] = useHover();
  const handleClick = () => {
    onClick?.(type, !toggled);
  };

  const Icon = toggled ? CheckboxMarkedCircleOutlineIcon : CheckboxBlankCircleOutlineIcon;

  return (
    <Flex
      onClick={handleClick}
      _hover={{ cursor: 'pointer' }}
      alignItems="center"
      {...bind}
      {...rest}
    >
      <IconButton
        color={toggled ? color('accent') : color('text-caption')}
        isHovered={isHovered}
        mr="tight"
        icon={Icon}
        size="24px"
        iconSize="16px"
        dark
      />
      <Tag border={border()} type={type} />
    </Flex>
  );
};

const getTypes = (currentTypes, { type, enabled }) => {
  if (enabled) {
    return [...new Set([...currentTypes, type])];
  }
  return currentTypes.filter(_type => type !== _type);
};

const FilterPanel = () => {
  const [filter, setFilterState] = useRecoilState(filterState);

  const handleChangeType = (type, enabled) => {
    setFilterState(state => {
      const newTypes = getTypes(state.types, { type, enabled });
      return {
        ...state,
        types: newTypes,
      };
    });
  };

  const handleClose = () => {
    setFilterState(state => ({ ...state, showing: false }));
  };

  return filter.showing ? (
    <>
      <Box
        position="absolute"
        top="33px"
        boxShadow="high"
        zIndex={100}
        p="base"
        pb="loose"
        bg={color('bg-light')}
        width="100%"
        borderRadius="0 0 16px 16px"
      >
        <Flex pb="base" alignItems="center" justifyContent="space-between">
          <Title>Filter transactions</Title>
          <IconButton onClick={handleClose} dark icon={CloseIcon} />
        </Flex>
        <Flex justifyContent="space-between">
          <Stack alignItems="flex-start" spacing="base">
            {types.map(type => (
              <CheckableElement
                onClick={handleChangeType}
                value={!!filter.types.find(_type => _type === type)}
                type={type}
                key={type}
              />
            ))}
          </Stack>
          <Stack alignItems="flex-end" spacing="base">
            <Toggle
              value={filter.showPending}
              onClick={() =>
                setFilterState(state => ({ ...state, showPending: !state.showPending }))
              }
              label="Show pending"
            />
            <Toggle
              value={filter.showFailed}
              onClick={() => setFilterState(state => ({ ...state, showFailed: !state.showFailed }))}
              label="Show failed"
            />
          </Stack>
        </Flex>
      </Box>
      <Box
        onClick={handleClose}
        position="absolute"
        top="33px"
        left={0}
        width="100%"
        height="calc(100% - 33px)"
        bg="rgba(0,0,0,0.5)"
        zIndex={99}
      />
    </>
  ) : null;
};

const PanelHeader = React.memo(() => {
  const [filter, setFilterState] = useRecoilState(filterState);

  const handleFilterToggle = () => {
    setFilterState(state => ({ ...state, showing: !state.showing }));
  };
  return (
    <>
      <Flex
        justifyContent="space-between"
        px="base"
        borderBottom={border()}
        py="tight"
        bg={color('bg')}
      >
        <Caption>Transactions</Caption>

        <Caption
          display="flex"
          alignItems="center"
          _hover={{ cursor: 'pointer', color: color('text-title') }}
          onClick={handleFilterToggle}
        >
          <FilterIcon mr="extra-tight" color="currentColor" size="18px" strokeWidth={1.5} />
          Filter transactions
        </Caption>
      </Flex>
    </>
  );
});

const LoadButton = ({ codeBody }: { codeBody: string }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const [_, setCodeBody] = useCodeEditor();
  const { setResult } = useClarityRepl();

  return loaded ? (
    <Badge userSelect="none" border={border()} color={color('text-caption')}>
      Loaded!
    </Badge>
  ) : !clicked ? (
    <Badge
      userSelect="none"
      _hover={{ cursor: 'pointer', color: color('text-title') }}
      border={border()}
      color={color('text-caption')}
      onClick={() => setClicked(true)}
    >
      Load in editor
    </Badge>
  ) : (
    <Badge userSelect="none" border={border()} color={color('text-caption')}>
      <Flex>
        <Box
          _hover={{ cursor: 'pointer', color: color('text-title') }}
          pr="tight"
          onClick={() => setClicked(false)}
        >
          Cancel
        </Box>
        <Box
          _hover={{ cursor: 'pointer', color: color('text-title') }}
          pl="tight"
          borderLeft={border()}
          onClick={() => {
            setClicked(false);
            setCodeBody(codeBody);
            setLoaded(true);
            setResult(undefined);
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
  const setView = useSetRecoilState(contractCallViewState);
  const setQuery = useSetRecoilState(contractSearchQueryState);
  const setCurrentFunction = useSetRecoilState(currentFunctionState);
  const setTab = useSetRecoilState(tabState);

  const handleSetFunction = (name: string) => {
    setView('fn');
    setQuery(contractId);
    setCurrentFunction(name);
    setTab('call');
  };

  return hasFunctionsAvailable ? (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderBottom={border()}
        px="base"
        pb="tight"
        pt="base-tight"
        _hover={{
          bg: color('bg-alt'),
        }}
      >
        <Caption fontWeight="500" color={color('text-body')}>
          Available functions
        </Caption>
        <ChevronDown color={color('text-caption')} size="18px" />
      </Flex>
      <Stack maxHeight="120px" overflowX="auto" spacing="0">
        {contractInterface?.abi?.functions?.map(
          (func: ContractInterfaceFunction, index: number, arr: ContractInterfaceFunction[]) => {
            return func.access !== 'private' ? (
              <Flex
                borderBottom={index === arr.length - 1 ? 'unset' : border()}
                px="base"
                py="tight"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" color={color('text-caption')}>
                  {func.access === 'read_only' ? (
                    <InfoCircleIcon size="18px" />
                  ) : (
                    <ContractCallIcon size="18px" />
                  )}
                  <Caption color={color('text-body')} ml="extra-tight">
                    {func.name}
                  </Caption>
                </Flex>
                {status === 'success' ? (
                  <Badge
                    _hover={{ color: color('text-title'), cursor: 'pointer' }}
                    color={color('text-caption')}
                    border={border()}
                    onClick={() => handleSetFunction(func.name)}
                  >
                    Load function
                  </Badge>
                ) : null}
              </Flex>
            ) : null;
          }
        )}
      </Stack>
    </>
  ) : null;
};

const TxDetails: React.FC<{
  status?: Transaction['tx_status'];
  type: Transaction['tx_type'];
  txId: Transaction['tx_id'];
  contractId: string;
}> = React.memo(({ contractId, txId, type, status }) => {
  const apiServer = useApiServer();
  const contractInterface = useRecoilValue(
    txContractState({
      apiServer,
      contractId,
    })
  );

  const hasFunctionsAvailable =
    type === 'smart_contract' && status === 'success' && contractInterface?.abi?.functions?.length;

  return (
    <>
      <Box>
        <Box>
          <Flex
            justifyContent="space-between"
            borderBottom={hasFunctionsAvailable ? border() : 'unset'}
            px="base"
            py="tight"
            alignItems="center"
          >
            <Caption fontWeight="500" color={color('text-body')}>
              Redeploy contract
            </Caption>
            <LoadButton codeBody={contractInterface.source_code} />
          </Flex>
          <TxDetailsFunctions
            contractId={contractId}
            status={status}
            hasFunctionsAvailable={hasFunctionsAvailable}
            contractInterface={contractInterface}
          />
          <TxLink txid={txId}>
            <Flex
              as="a"
              _hover={{
                bg: color('bg-alt'),
              }}
              borderTop={border()}
              px="base"
              py="base-tight"
              alignItems="center"
              target="_blank"
            >
              <Caption
                mr="tight"
                fontWeight="500"
                color={color('text-body')}
                transform="translateY(1px)"
              >
                View transaction
              </Caption>
              <ExternalLinkIcon color={color('text-caption')} size="18px" />
            </Flex>
          </TxLink>
        </Box>
      </Box>
    </>
  );
});

const SandboxTxItem = React.memo(({ tx }: { tx: Transaction }) => {
  const { principal } = useUser();
  const [detailsVisibility, setDetailsVisibility] = useRecoilState(txDetailsState(tx.tx_id));
  const detailsVisible = detailsVisibility === 'visible';

  return (
    <Box key={tx.tx_id} borderBottom={border()}>
      <Flex alignItems="center" justifyContent="space-between">
        <TxItem
          width="unset"
          flexGrow={0}
          hideRightElements
          minimal
          principal={principal}
          tx={tx}
        />
        {tx.tx_type === 'smart_contract' || tx.tx_type === 'contract_call' ? (
          <IconButton
            color={color('text-caption')}
            _hover={{ bg: color('bg-alt') }}
            invert
            mr="base"
            onClick={() => {
              if (detailsVisibility === 'hidden') {
                setDetailsVisibility('visible');
              } else {
                setDetailsVisibility('hidden');
              }
            }}
            icon={(p: any) => (
              <ChevronDown
                transform={detailsVisible ? 'rotate(180deg)' : 'none'}
                strokeWidth={2.5}
                {...p}
              />
            )}
          />
        ) : null}
      </Flex>
      {detailsVisible && (tx.tx_type === 'smart_contract' || tx.tx_type === 'contract_call') ? (
        <Box px="base" pb="base">
          <Box boxShadow="mid" borderRadius={'12px'} border={border()} bg={color('bg')}>
            <React.Suspense
              fallback={
                <Box p="base">
                  <Flex>
                    <Pending mr="base" size={'14px'} />
                    <Caption>Fetching contract interface</Caption>
                  </Flex>
                </Box>
              }
            >
              <TxDetails
                txId={tx.tx_id}
                type={tx.tx_type}
                status={tx.tx_status}
                contractId={
                  tx.tx_type === 'smart_contract'
                    ? tx.smart_contract.contract_id
                    : tx.contract_call.contract_id
                }
              />
            </React.Suspense>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
});

const FilteredMessage = () => {
  const [filter, setFilterState] = useRecoilState(filterState);
  const handleOpen = () => {
    setFilterState(state => ({ ...state, showing: true }));
  };
  return (
    <Grid p="extra-loose" textAlign="center">
      <Grid
        mx="auto"
        placeItems="center"
        size="72px"
        borderRadius="100%"
        color={color('text-title')}
        mb="base-loose"
        bg={blue(0.3)}
      >
        <Box color={color('accent')} transform="translateY(2px)" size="48px">
          <FilterIcon size="48px" />
        </Box>
      </Grid>
      <Title mb="tight" fontSize="20px">
        Transactions filtered
      </Title>
      <Text maxWidth="30ch" mx="auto" lineHeight="1.8" color={color('text-body')}>
        You have confirmed transactions, but they aren't currently visible due to your filter
        settings.
      </Text>
      <Badge
        _hover={{ cursor: 'pointer', bg: color('bg-alt') }}
        mx="auto"
        mt="base"
        border={border()}
        color={color('text-body')}
        onClick={handleOpen}
      >
        Change filters
      </Badge>
    </Grid>
  );
};

const TxList: React.FC = React.memo(() => {
  const filters = useRecoilValue(filterState);
  const { transactions, pendingTransactions, principal } = useUser({ suspense: true });

  const filteredTxs = transactions?.filter(tx => filters.types.find(type => type === tx.tx_type));
  const hasTxButIsFiltered = transactions?.length && filteredTxs?.length === 0;

  const pendingList = React.useMemo(
    () =>
      pendingTransactions?.map(tx => (
        <Flex borderBottom={border()} pr="base" alignItems="center" justifyContent="space-between">
          <TxItem
            hideRightElements
            minimal
            principal={principal}
            tx={tx}
            key={tx.tx_id}
            width="auto"
          />
          <TxLink txid={tx.tx_id}>
            <IconButton as="a" target="_blank" flexShrink={0} dark icon={ExternalLinkIcon} />
          </TxLink>
        </Flex>
      )),
    [pendingTransactions]
  );

  const txList = React.useMemo(
    () =>
      filteredTxs.map(tx =>
        tx.tx_status !== 'success' && !filters.showFailed ? null : (
          <SandboxTxItem tx={tx} key={tx.tx_id} />
        )
      ),
    [filteredTxs, filters.types, filters.showFailed, transactions]
  );

  return (
    <>
      {pendingTransactions?.length && filters.showPending ? pendingList : null}
      {filteredTxs?.length ? txList : hasTxButIsFiltered ? <FilteredMessage /> : null}
    </>
  );
});

const TxLoadingPanel = React.memo(() => (
  <Box p="extra-loose" flexGrow={1} width="100%">
    <Flex flexDirection="column" alignItems="center">
      <Grid placeItems="center" borderRadius="100%" size="64px" border={border()} boxShadow="mid">
        <Pending opacity={0.5} size="32px" />
      </Grid>
      <Text mt="base" fontWeight="500" fontSize="14px" color={color('text-caption')}>
        Fetching transactions...
      </Text>
    </Flex>
  </Box>
));

export const TransactionsPanel = React.memo(props => {
  return (
    <Flex
      position="relative"
      flexDirection="column"
      flexGrow={1}
      bg={color('bg-alt')}
      borderLeft={border()}
      {...props}
    >
      <PanelHeader />
      <FilterPanel />

      <Flex
        flexDirection="column"
        flexGrow={1}
        maxHeight="900px"
        overflow="auto"
        bg={color('bg')}
        position="relative"
      >
        <React.Suspense fallback={<TxLoadingPanel />}>
          <TxList />
        </React.Suspense>
      </Flex>
    </Flex>
  );
});
