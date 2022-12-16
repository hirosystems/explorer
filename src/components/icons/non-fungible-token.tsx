import React from 'react';

import { BaseSvg, SvgProps } from '@components/icons/_base';

export const NonFungibleTokenIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <circle cx="12" cy="12" r="9" />
  </BaseSvg>
);
