import React from 'react';

import { BaseSvg, SvgProps } from '@components/icons/_base';

export const GiftIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <line x1="12" y1="8" x2="12" y2="21" />
    <path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" />
  </BaseSvg>
);
