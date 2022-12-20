import React from 'react';

import { BaseSvg, SvgProps } from '@components/icons/_base';

export const AlertTriangleIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M12 9v2m0 4v.01" />
    <path d="M5.07 19H19a2 2 0 0 0 1.75 -2.75L13.75 4a2 2 0 0 0 -3.5 0L3.25 16.25a2 2 0 0 0 1.75 2.75" />
  </BaseSvg>
);
