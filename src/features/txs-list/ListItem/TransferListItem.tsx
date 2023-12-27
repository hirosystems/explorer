import { FC, memo, useMemo } from 'react';
import * as React from 'react';
import { TbArrowDown, TbArrowUp } from 'react-icons/tb';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { Circle } from '../../../common/components/Circle';
import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { PrincipalLink } from '../../../common/components/transaction-item';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { HStack } from '../../../ui/HStack';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import { useBreakpointValue } from '../../../ui/hooks/useBreakpointValue';
import { Caption, Text, Title } from '../../../ui/typography';

interface TransferListItemProps {
  title: string;
  sender?: string;
  recipient?: string;
  amount: string;
  isOriginator: boolean;
}

export const TransferListItem: FC<TransferListItemProps> = memo(
  ({ title, sender, recipient, amount, isOriginator }) => {
    const circleSize = useBreakpointValue(
      {
        lg: '10',
        md: '4.5',
        sm: '4.5',
        xs: '4.5',
        base: '4.5',
      },
      {
        fallback: 'lg',
        ssr: false,
      }
    );

    const iconSize = useBreakpointValue(
      {
        lg: '4',
        md: '2.5',
        sm: '2.5',
        xs: '2.5',
        base: '2.5',
      },
      {
        fallback: 'lg',
        ssr: false,
      }
    );

    const icon = useMemo(
      () =>
        isOriginator ? (
          <Circle bg={'bg'} size={circleSize}>
            <Icon as={TbArrowUp} size={iconSize} />
          </Circle>
        ) : (
          <Circle bg={'bg'} size={circleSize}>
            <Icon as={TbArrowDown} size={iconSize} />
          </Circle>
        ),
      [isOriginator]
    );

    const leftSubtitle = useMemo(
      () => (
        <HStack spacing={1} alignItems="center" flexWrap="wrap" divider={<Caption>∙</Caption>}>
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
        </HStack>
      ),
      [isOriginator, sender, recipient]
    );

    return (
      <TwoColsListItem
        icon={icon}
        leftContent={{ title, subtitle: leftSubtitle }}
        rightContent={{ title: amount, subtitle: null }}
      />
    );
  }
);
