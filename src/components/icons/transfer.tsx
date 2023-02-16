import { BaseSvg, SvgProps } from '@/components/icons/_base';
import React from 'react';

export const TransferIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="7 8 3 12 7 16" />
    <polyline points="17 8 21 12 17 16" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </BaseSvg>
);
