import { BaseSvg, SvgProps } from '@/components/icons/_base';
import React from 'react';

export const ArrowRightIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <line x1="5" y1="12" x2="19" y2="12" />
    <line x1="13" y1="18" x2="19" y2="12" />
    <line x1="13" y1="6" x2="19" y2="12" />
  </BaseSvg>
);
