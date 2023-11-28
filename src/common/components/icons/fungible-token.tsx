import React from 'react';

import { BaseSvg, SvgProps } from './_base';

export const FungibleTokenIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <circle cx="9.5" cy="9.5" r="6.5" />
    <rect x="10" y="10" width="11" height="11" rx="2" />
  </BaseSvg>
);
