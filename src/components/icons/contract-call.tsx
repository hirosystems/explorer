import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const ContractCallIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="5 7 10 12 5 17" />
    <line x1="13" y1="17" x2="19" y2="17" />
  </BaseSvg>
);
