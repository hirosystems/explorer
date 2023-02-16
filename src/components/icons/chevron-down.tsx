import { BaseSvg, SvgProps } from '@/components/icons/_base';
import React from 'react';

export const ChevronDown: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 9 12 15 18 9" />
  </BaseSvg>
);
