import * as React from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { BoxProps, Flex, FlexProps, Stack, color } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

import { getTxTitle, toRelativeTime, truncateMiddle } from '@common/utils';

import { ArrowRightIcon } from '@components/icons/arrow-right';
import { ItemIcon, getTxTypeIcon } from '@components/item-icon';
import { Link } from '@components/link';
import { ExplorerLink } from '@components/links';
import { getTransactionTypeLabel } from '@components/token-transfer/utils';
import { Tooltip } from '@components/tooltip';
import { Caption, Text, Title } from '@components/typography';

export { getTxTypeIcon };

export interface TxItemProps extends FlexProps {
  tx: Transaction | MempoolTransaction;
  minimal?: boolean;
  isFocused?: boolean;
  isHovered?: boolean;
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
    <ExplorerLink path={`/address/${encodeURIComponent(principal)}`}>
      <Caption
        as={Link}
        _hover={{
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
          <Stack
            flexWrap="wrap"
            isInline
            spacing="extra-tight"
            {...({ as: 'span', ...rest } as any)}
          >
            <Caption display={['none', 'none', 'none', 'block']}>Sent to</Caption>
            <PrincipalLink principal={tx.token_transfer.recipient_address} />
          </Stack>
        );
      } else if (tx.token_transfer.recipient_address === principal) {
        return (
          <Stack
            flexWrap="wrap"
            isInline
            spacing="extra-tight"
            {...({ as: 'span', ...rest } as any)}
          >
            <Caption display={['none', 'none', 'none', 'block']}>Received from</Caption>
            <PrincipalLink principal={tx.sender_address} />
          </Stack>
        );
      }
      return (
        <Stack flexWrap="wrap" isInline spacing="extra-tight" {...({ as: 'span', ...rest } as any)}>
          <PrincipalLink principal={tx.sender_address} />
          <Flex as="span" color={color('text-caption')}>
            <ArrowRightIcon strokeWidth="1.5" size="15px" />
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
  <Stack as="span" spacing="tight" flexWrap="wrap">
    <Title className={'search-result-title'} fontWeight="500" display="block" fontSize="16px">
      {title}
    </Title>
    <Stack
      as="span"
      isInline
      spacing="extra-tight"
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
    const { tx, ...rest } = props;
    const date = getRelativeTimestamp(tx);

    return (
      <Text ml="tight" fontSize="14px" textAlign="right" color={color('text-body')} {...rest}>
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

const LargeVersion = React.memo(
  ({
    tx,
    principal,
    hideIcon,
    hideRightElements,
    isHovered,
  }: {
    tx: Transaction | MempoolTransaction;
    principal?: string;
    hideIcon?: boolean;
    isHovered?: boolean;
    hideRightElements?: boolean;
  }) => {
    const title = getTxTitle(tx, true);

    const isPending = tx.tx_status === 'pending';
    const isConfirmed = tx.tx_status === 'success';
    const isAnchored = !(tx as any).is_unanchored;
    const didFail = !isPending && !isConfirmed;

    return (
      <>
        <Flex display="flex" as="span" alignItems="center" data-test="tx-item">
          {!hideIcon ? <ItemIcon mr="base" type="tx" tx={tx} /> : null}
          <TxItemTitleArea
            isHovered={isHovered}
            title={title || truncateMiddle(tx.tx_id, 12)}
            tx={tx}
            principal={principal}
          />
        </Flex>
        {!hideRightElements ? (
          <Stack alignItems="flex-end" textAlign="right" as="span" spacing="tight">
            <Timestamp tx={tx} suppressHydrationWarning={true} />
            <Flex justifyContent="flex-end" alignItems="flex-end" flexWrap="wrap">
              <Caption
                mr="6px"
                as="span"
                data-test="tx-caption"
                color={didFail ? color('feedback-error') : color('invert')}
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
      </>
    );
  }
);

export const TxItem = React.memo(
  forwardRefWithAs<TxItemProps, 'span'>((props, ref) => {
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
    return (
      <Flex
        justifyContent="space-between"
        alignItems="stretch"
        outline="none"
        py="loose"
        flexShrink={0}
        ref={ref}
        width="100%"
        as={as}
        {...rest}
        display="flex"
      >
        <LargeVersion
          hideRightElements={hideRightElements}
          hideIcon={hideIcon}
          principal={principal}
          tx={tx as any}
        />
      </Flex>
    );
  })
);
