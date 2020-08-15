import { BaseSvg, SvgProps } from '@components/icons/_base';

import React from 'react';

export const CheckIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
  </BaseSvg>
);
