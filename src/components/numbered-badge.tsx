import pluralize from 'pluralize';
import * as React from 'react';

import { Box, color } from '@stacks/ui';

import { Badge, BadgeProps } from '@components/badge';

export const NumberedBadge = ({
  array,
  amount,
  singular,
  icon: Icon,
  ...rest
}: { array?: any[]; amount?: number; singular: string; icon?: any } & BadgeProps) =>
  amount || array?.length ? (
    <Badge
      color={color('text-body')}
      labelProps={{ display: 'flex', alignItems: 'center' }}
      alignItems="center"
      bg={color('bg-alt')}
      my={0}
      {...rest}
    >
      {Icon && <Icon strokeWidth={2} size="16px" />}
      <Box ml={'extra-tight'}>
        {amount || array?.length} {pluralize(singular, amount || array?.length)}
      </Box>
    </Badge>
  ) : null;
