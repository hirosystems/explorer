import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const SendIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <line x1="14" y1="12" x2="4" y2="12" />
    <line x1="14" y1="12" x2="10" y2="16" />
    <line x1="14" y1="12" x2="10" y2="8" />
    <line x1="20" y1="4" x2="20" y2="20" />
  </BaseSvg>
);
