import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const DiceIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="8.5" cy="8.5" r=".5" fill="currentColor" />
    <circle cx="15.5" cy="8.5" r=".5" fill="currentColor" />
    <circle cx="15.5" cy="15.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="15.5" r=".5" fill="currentColor" />
  </BaseSvg>
);
