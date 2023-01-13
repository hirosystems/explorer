import { Badge, BadgeProps } from '@/common/components/Badge';
import { Box } from '@/ui/components';
import pluralize from 'pluralize';
import * as React from 'react';

export const NumberedBadge = ({
  array,
  amount,
  singular,
  icon: Icon,
  ...rest
}: { array?: any[]; amount?: number; singular: string; icon?: any } & BadgeProps) =>
  amount || array?.length ? (
    <Badge
      color={'textBody'}
      labelProps={{ display: 'flex', alignItems: 'center' }}
      alignItems="center"
      bg={'bgAlt'}
      my={0}
      border={'none'}
      {...rest}
    >
      {Icon && <Icon strokeWidth={2} size="16px" />}
      <Box ml={'4px'}>
        {amount || array?.length} {pluralize(singular, amount || array?.length)}
      </Box>
    </Badge>
  ) : null;
