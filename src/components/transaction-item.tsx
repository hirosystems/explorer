import React from 'react';
import { BoxProps, Flex, FlexProps, Stack, color } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';
import { Transaction, MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { getTxTitle, toRelativeTime, truncateMiddle } from '@common/utils';
import { forwardRefWithAs } from '@stacks/ui-core';

import { getTransactionTypeLabel } from '@components/token-transfer/utils';
import { ArrowRightIcon } from '@components/icons/arrow-right';
import { Link } from '@components/link';
import NextLink from 'next/link';
import { getTxTypeIcon, ItemIcon } from '@components/item-icon';
import { useHoverableState } from '@components/hoverable';
import { Tooltip } from '@components/tooltip';

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

const PrincipalLink: React.FC<FlexProps & { principal: string }> = ({ principal, ...rest }) => (
  <Flex display="inline-flex" position={'relative'} zIndex={2} as="span" {...rest}>
    <NextLink href={`/address/${principal}`} passHref>
      <Caption
        as={Link}
        _hover={{
          textDecoration: 'underline',
        }}
        textDecoration="none"
      >
        {truncateMiddle(principal)}
      </Caption>
    </NextLink>
  </Flex>
);

const AddressArea = React.memo(
  ({ tx, principal, ...rest }: { tx: Transaction; principal?: string } & FlexProps) => {
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

const TxItemTitleArea = React.memo(({ title, isHovered, tx, principal }: any) => (
  <Stack as="span" spacing="tight" flexWrap="wrap">
    <Title
      color={isHovered ? color('accent') : color('text-title')}
      fontWeight="500"
      display="block"
      fontSize="16px"
    >
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

const Timestamp: React.FC<BoxProps & { tx: Transaction | MempoolTransaction }> = React.memo(
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

const Nonce: React.FC<BoxProps & { nonce: Number, isHovered?: boolean }> = React.memo(
  props => (
      <>
        {'·'}
        <Tooltip label="Nonce">
          <Caption as="span" text-align="right" ml="6px" style={{zIndex:1}}>
            {props.nonce + "n"}
          </Caption>
        </Tooltip>
      </>
    )
);

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
    const title = getTxTitle(tx);

    const isPending = tx.tx_status === 'pending';
    const isConfirmed = tx.tx_status === 'success';
    const isAnchored = !(tx as any).is_unanchored;
    const didFail = !isPending && !isConfirmed;

    return (
      <>
        <Flex display="flex" as="span" alignItems="center">
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
            <Timestamp tx={tx} />
            <Flex justifyContent="flex-end" alignItems="flex-end" flexWrap="wrap">
              <Caption
                mr="6px"
                as="span"
                color={didFail ? color('feedback-error') : color('invert')}
              >
                {isPending && 'Pending'}
                {isConfirmed && !isAnchored && 'In microblock'}
                {isConfirmed && isAnchored && 'In anchor block'}
                {didFail && 'Failed'}
              </Caption>
              {'·'}
              <Caption mt="1px" ml="6px" mr={isPending && "6px"}>
                {truncateMiddle(tx.tx_id, 4)}
              </Caption>

              { isPending &&
                <Nonce ml="6px" nonce={tx.nonce}/>
              }
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
      isHovered: isHoveredProp,
      isFocused,
      minimal = false,
      as = 'span',
      principal,
      hideIcon,
      hideRightElements,
      ...rest
    } = props;

    const isHoverableHovered = useHoverableState();

    const isHovered = isHoverableHovered || isHoveredProp;

    return (
      <Flex
        justifyContent="space-between"
        alignItems="stretch"
        outline="none"
        py="loose"
        flexShrink={0}
        ref={ref}
        cursor={isHovered ? ['unset', 'unset', 'pointer'] : undefined}
        width="100%"
        as={as}
        {...rest}
        display="flex"
      >
        <LargeVersion
          isHovered={isHovered}
          hideRightElements={hideRightElements}
          hideIcon={hideIcon}
          principal={principal}
          tx={tx as any}
        />
      </Flex>
    );
  })
);
