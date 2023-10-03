import pluralize from 'pluralize';
import React from 'react';
import { Caption, TextProps } from '@/ui/typography';

export function PluralizedCaption({
  array,
  label,
  ...rest
}: TextProps & { array?: any[]; label: string }) {
  return (
    <Caption color="textBody" fontSize="14px" {...rest}>
      {array?.length || 0} {pluralize(label, array?.length || 0)}
    </Caption>
  );
}
