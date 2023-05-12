import { buildUrl } from '@/app/common/utils/buildUrl';
import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { useGlobalContext } from '@/common/context/useAppContext';
import { PrincipalLink } from '@/components/transaction-item';
import { Circle } from '@/ui/Circle';
import { Stack } from '@/ui/Stack';
import { Caption, Text, Title } from '@/ui/typography';
import * as React from 'react';
import { FC, memo, useMemo } from 'react';
import { TbArrowDown, TbArrowUp } from 'react-icons/tb';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

interface TransferListItemProps {
  tx: Transaction;
  title: string;
  sender?: string;
  recipient?: string;
  amount: string;
  isOriginator: boolean;
}

export const TransferListItem: FC<TransferListItemProps> = memo(
  ({ tx, title, sender, recipient, amount, isOriginator }) => {
    const network = useGlobalContext().activeNetwork;
    const href = buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, network);

    const icon = useMemo(
      () =>
        isOriginator ? (
          <Circle bg={'bg'} size={'40px'}>
            <TbArrowUp color={'invert'} fill={'bg'} size={'16px'} />
          </Circle>
        ) : (
          <Circle bg={'bg'} size={'40px'}>
            <TbArrowDown color={'invert'} fill={'bg'} size={'16px'} />
          </Circle>
        ),
      [isOriginator]
    );

    const leftTitle = useMemo(
      () => (
        <Title fontWeight="500" display="block" fontSize="16px">
          {title}
        </Title>
      ),
      [title]
    );

    const leftSubtitle = useMemo(
      () => (
        <Stack
          as="span"
          isInline
          spacing="4px"
          alignItems="center"
          flexWrap="wrap"
          divider={<Caption>∙</Caption>}
        >
          {isOriginator && recipient && (
            <Caption>
              to <PrincipalLink principal={recipient} />
            </Caption>
          )}
          {!isOriginator && sender && (
            <Caption>
              from <PrincipalLink principal={sender} />
            </Caption>
          )}
        </Stack>
      ),
      [isOriginator, sender, recipient]
    );

    const rightTitle = useMemo(
      () => (
        <Text fontSize="14px" textAlign="right" color={'textBody'}>
          {amount}
        </Text>
      ),
      [amount]
    );

    return (
      <TwoColsListItem
        icon={icon}
        leftContent={{ title: leftTitle, subtitle: leftSubtitle }}
        rightContent={{ title: rightTitle, subtitle: null }}
        pl={'56px'}
      />
    );
  }
);
