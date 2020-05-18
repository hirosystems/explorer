import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useHover, useFocus } from 'use-events';
import { Flex, Box, BlockstackIcon, FlexProps, BoxProps, useEventListener } from '@blockstack/ui';
import { Tag } from '@components/tags';
import { microToStacks, truncateMiddle } from '@common/utils';
import { Transaction, TransactionType } from '@models/transaction.interface';
import { Caption, Title } from '@components/typography';
import { getContractName } from '@common/utils';
import { DefaultContract } from '@components/icons/default-contract';

export const ItemIcon = React.memo(({ type, ...rest }: { type: Transaction['tx_type'] }) => {
  switch (type) {
    case 'smart_contract' || 'contract_call':
      return (
        <Box display={['none', 'none', 'block']} {...rest}>
          <DefaultContract size="36px" />
        </Box>
      );
    default:
      return (
        <Box display={['none', 'none', 'block']} {...rest}>
          <BlockstackIcon size="36px" />
        </Box>
      );
  }
});

dayjs.extend(relativeTime);

export interface RecentlyViewedProps extends FlexProps {
  transactions: Transaction[];
}

interface RecentlyViewedListItemProps extends BoxProps {
  option: Transaction;
  isLast: boolean;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;
  onClick: (e?: any) => void;
  focused?: boolean;
}

const getTitle = (transaction: Transaction) => {
  switch (transaction.tx_type) {
    case 'smart_contract':
      return getContractName(transaction.smart_contract.contract_id);
    case 'contract_call':
      return getContractName(transaction.contract_call.contract_id);
    case 'token_transfer':
      return 'Token transfer';
    default:
      return truncateMiddle(transaction.tx_id, 10);
  }
};

const getCaption = (tx: Transaction) => {
  const date = dayjs().to((tx as any).viewedDate);
  const truncatedId = truncateMiddle(tx.tx_id, 4);
  switch (tx.tx_type) {
    case 'smart_contract':
      return date + ' ∙ ' + truncatedId;
    case 'contract_call':
      return date + ' ∙ ' + truncatedId;
    case 'token_transfer':
      return date + ' ∙ ' + microToStacks(tx.token_transfer.amount) + ' STX';
    default:
      return date;
  }
};

export const RecentlyViewedListItem = ({
  option,
  isLast,
  onFocus,
  onBlur,
  focused,
  onClick,
  ...rest
}: RecentlyViewedListItemProps) => {
  const [isHovered, bindHover] = useHover();
  const [isFocused, bindFocus] = useFocus();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [localFocus, setLocalFocus] = React.useState<boolean>(false);

  const handleFocus = (e?: React.FocusEvent) => {
    e?.preventDefault();
    onFocus(e);
    bindFocus.onFocus(e as any);
  };

  const handleBlur = (e?: React.FocusEvent) => {
    e?.preventDefault();
    onBlur(e);
    bindFocus.onBlur(e as any);
  };

  useEventListener('keydown', event => {
    if (event.key === 'Enter' && (focused || isFocused)) {
      onClick && onClick();
    }
  });

  React.useEffect(() => {
    if (focused && ref.current) {
      setLocalFocus(true);
      ref.current.focus();
      handleFocus();
    }
    if (!focused && localFocus && ref.current) {
      setLocalFocus(false);
      ref.current.blur();
      handleBlur();
    }
  }, [focused, ref]);

  return (
    <Flex
      px="base"
      justifyContent="space-between"
      alignItems="center"
      height="64px"
      borderBottom={isLast ? null : '1px solid var(--colors-border)'}
      cursor="pointer"
      style={{ outline: 'none' }}
      flexShrink={0}
      {...bindHover}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      tabIndex={0}
      {...rest}
      ref={ref}
    >
      <Flex align="center">
        <Box opacity={0.3} color="var(--colors-invert)" mr="base">
          <ItemIcon type={option.tx_type} />
        </Box>
        <Flex flexDirection="column">
          <Title
            fontSize="14px"
            display="block"
            textDecoration={isHovered || isFocused ? 'underline' : null}
          >
            {getTitle(option)}
          </Title>
          <Caption>{getCaption(option)}</Caption>
        </Flex>
      </Flex>
      <Box>
        <Tag type={option.tx_type as TransactionType} />
      </Box>
    </Flex>
  );
};
