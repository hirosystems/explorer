import { useGlobalContext } from '@/common/context/useAppContext';
import { toRelativeTime, truncateMiddle } from '@/common/utils';
import { getTransactionStatus } from '@/common/utils/transactions';
import { ExplorerLink, buildUrl } from '@/components/links';
import { BoxProps, Circle, Flex, FlexProps, Icon, Stack, Tooltip } from '@/ui/components';
import { Caption, Text, Title } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { FC } from 'react';
import { HiOutlineArrowSmRight } from 'react-icons/hi';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxIcon, getTxTypeIcon } from '../app/common/components/TxIcon';
import { useTxTitle } from '../app/common/components/tx-lists/common/utils/tx';
import { getTransactionTypeLabel } from '../app/common/components/tx-lists/utils/tx';

export { getTxTypeIcon };

export interface TxItemProps extends FlexProps {
  tx: Transaction | MempoolTransaction;
  minimal?: boolean;
  isFocused?: boolean;
  target?: string;
  principal?: string;
  onClick?: any;
  onFocus?: any;
  onBlur?: any;
  tabIndex?: any;
  hideIcon?: boolean;
  hideRightElements?: boolean;
}

const getRelativeTimestamp = (tx: Transaction | MempoolTransaction) => {
  const date =
    typeof (tx as any).burn_block_time !== 'undefined' && (tx as any).burn_block_time !== -1
      ? toRelativeTime((tx as any).burn_block_time * 1000)
      : (tx as any).burn_block_time === -1
      ? toRelativeTime((tx as any).parent_burn_block_time * 1000)
      : (tx as any).receipt_time
      ? toRelativeTime((tx as any).receipt_time * 1000)
      : 'Pending...';

  return date;
};

export const PrincipalLink: React.FC<FlexProps & { principal: string }> = ({
  principal,
  ...rest
}) => (
  <Flex display="inline-flex" position={'relative'} zIndex={2} as="span" {...rest}>
    <ExplorerLink href={`/address/${encodeURIComponent(principal)}`}>
      <Caption
        as={'a'}
        color={`links.${useColorMode().colorMode}`}
        _hover={{
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        textDecoration="none"
      >
        {truncateMiddle(principal)}
      </Caption>
    </ExplorerLink>
  </Flex>
);

export const AddressArea = React.memo(
  ({
    tx,
    principal,
    ...rest
  }: { tx: Transaction | MempoolTransaction; principal?: string } & FlexProps) => {
    if (tx.tx_type === 'token_transfer') {
      if (tx.sender_address === principal) {
        return (
          <Stack flexWrap="wrap" isInline {...({ as: 'span', ...rest } as any)}>
            <Caption display={['none', 'none', 'none', 'block']}>Sent to</Caption>
            <PrincipalLink principal={tx.token_transfer.recipient_address} />
          </Stack>
        );
      } else if (tx.token_transfer.recipient_address === principal) {
        return (
          <Stack flexWrap="wrap" isInline {...({ as: 'span', ...rest } as any)}>
            <Caption display={['none', 'none', 'none', 'block']}>Received from</Caption>
            <PrincipalLink principal={tx.sender_address} />
          </Stack>
        );
      }
      return (
        <Stack flexWrap="wrap" isInline {...({ as: 'span', ...rest } as any)}>
          <PrincipalLink principal={tx.sender_address} />
          <Flex as="span" color={'textCaption'}>
            <Icon as={HiOutlineArrowSmRight} strokeWidth="1.5" size="15px" />
          </Flex>
          <PrincipalLink principal={tx.token_transfer.recipient_address} />
        </Stack>
      );
    }
    if (tx.tx_type === 'contract_call') {
      return (
        <Caption>
          By <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    if (tx.tx_type === 'smart_contract') {
      return (
        <Caption>
          By <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    if (tx.tx_type === 'coinbase') {
      return (
        <Caption>
          Mined by <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    return null;
  }
);

const TxItemTitleArea = React.memo(({ title, tx, principal }: any) => (
  <Stack as="span" spacing="8px" flexWrap="wrap" minWidth={0}>
    <Title
      className={'search-result-title'}
      fontWeight="500"
      display="block"
      fontSize="16px"
      color={'midnight'}
    >
      {title}
    </Title>
    <Stack
      as="span"
      isInline
      spacing="4px"
      alignItems="center"
      flexWrap="wrap"
      divider={<Caption>∙</Caption>}
    >
      <Caption fontWeight="bold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
      <AddressArea principal={principal} tx={tx} />
    </Stack>
  </Stack>
));

export const Timestamp: React.FC<BoxProps & { tx: Transaction | MempoolTransaction }> = React.memo(
  props => {
    const { tx } = props;
    const date = getRelativeTimestamp(tx);

    return (
      <Text ml="8px" fontSize="14px" textAlign="right" color={'textBody'} suppressHydrationWarning>
        {date}
      </Text>
    );
  }
);

export const Nonce: React.FC<{ nonce: number }> = React.memo(({ nonce }) => (
  <>
    {'·'}
    <Tooltip label="Nonce">
      <Caption as="span" text-align="right" ml="6px" style={{ zIndex: 1 }}>
        {nonce.toString() + 'n'}
      </Caption>
    </Tooltip>
  </>
));

export const TxItem: FC<TxItemProps> = props => {
  const {
    tx,
    isFocused,
    minimal = false,
    as = 'span',
    principal,
    hideIcon,
    hideRightElements,
    ...rest
  } = props;
  const network = useGlobalContext().activeNetwork;
  const href = buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, network);
  const title = useTxTitle(tx, href, true);
  const isPending = tx.tx_status === 'pending';
  const isConfirmed = tx.tx_status === 'success';
  const isAnchored = !(tx as any).is_unanchored;
  const didFail = !isPending && !isConfirmed;
  return (
    <Flex
      justifyContent="space-between"
      alignItems="stretch"
      outline="none"
      py="24px"
      flexShrink={0}
      width="100%"
      as={as}
      {...rest}
      display="flex"
    >
      <Flex display="flex" as="span" alignItems="center" data-test="tx-item" minWidth={0}>
        {!hideIcon ? (
          <Circle flexShrink={0}>
            <TxIcon mr="16px" txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />
          </Circle>
        ) : null}
        <TxItemTitleArea
          title={title || truncateMiddle(tx.tx_id, 12)}
          tx={tx}
          principal={principal}
        />
      </Flex>
      {!hideRightElements ? (
        <Stack alignItems="flex-end" textAlign="right" as="span" spacing="8px">
          <Timestamp tx={tx} />
          <Flex justifyContent="flex-end" alignItems="flex-end" flexWrap="wrap">
            <Caption
              mr="6px"
              as="span"
              data-test="tx-caption"
              color={didFail ? 'feedbackError' : 'invert'}
            >
              {isPending && 'Pending'}
              {isConfirmed && !isAnchored && 'In microblock'}
              {isConfirmed && isAnchored && 'In anchor block'}
              {didFail && 'Failed'}
            </Caption>
            {'·'}
            <Caption mt="1px" ml="6px" mr={isPending ? '6px' : undefined}>
              {truncateMiddle(tx.tx_id, 4)}
            </Caption>
            {isPending && <Nonce nonce={tx.nonce} />}
          </Flex>
        </Stack>
      ) : null}
    </Flex>
  );
};
