import * as React from 'react';

import pluralize from 'pluralize';

import { Box, color } from '@stacks/ui';
import { Badge, BadgeProps } from '@components/badge';

export const NumberedBadge = ({
  array,
  singular,
  icon: Icon,
  ...rest
}: { array: any[]; singular: string; icon?: any } & BadgeProps) =>
  array?.length ? (
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
        {array.length} {pluralize(singular, array.length)}
      </Box>
    </Badge>
  ) : null;
