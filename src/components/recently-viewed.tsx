import React from 'react';
import { useHover, useFocus } from 'use-events';
import { FlexProps, BoxProps, useEventListener } from '@stacks/ui';
import { Transaction } from '@models/transaction.interface';
import { TxItem } from '@components/transaction-item';
import { TxLink } from '@components/links';

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
    <TxLink txid={option.tx_id}>
      <TxItem
        borderBottom={isLast ? undefined : '1px solid var(--colors-border)'}
        {...bindHover}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex="0"
        {...(rest as any)}
        ref={ref}
        tx={option}
        isFocused={focused || isFocused}
        isHovered={isHovered}
        _hover={{
          bg: 'var(--colors-bg-alt)',
        }}
        as="a"
        onClick={onClick}
      />
    </TxLink>
  );
};
