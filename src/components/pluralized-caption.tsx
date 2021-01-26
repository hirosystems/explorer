import React from 'react';
import { BoxProps, color } from '@stacks/ui';
import { Caption } from '@components/typography';
import pluralize from 'pluralize';

export const PluralizedCaption: React.FC<BoxProps & { array?: any[]; label: string }> = ({
  array,
  label,
  ...rest
}) => (
  <Caption color={color('text-body')} fontSize="14px" {...rest}>
    {array?.length || 0} {pluralize(label, array?.length || 0)}
  </Caption>
);
