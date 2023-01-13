import { Caption, TextProps } from '@/ui/typography';
import pluralize from 'pluralize';
import React from 'react';

export const PluralizedCaption: React.FC<TextProps & { array?: any[]; label: string }> = ({
  array,
  label,
  ...rest
}) => (
  <Caption color={'textBody'} fontSize="14px" {...rest}>
    {array?.length || 0} {pluralize(label, array?.length || 0)}
  </Caption>
);
