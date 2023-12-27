'use client';

import pluralize from 'pluralize';
import React from 'react';

import { TextProps } from '../../../../ui/Text';
import { Caption } from '../../../../ui/typography';

export const PluralizedCaption: React.FC<TextProps & { array?: any[]; label: string }> = ({
  array,
  label,
  ...rest
}) => (
  <Caption fontSize="14px" {...rest}>
    {array?.length || 0} {pluralize(label, array?.length || 0)}
  </Caption>
);
