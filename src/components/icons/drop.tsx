import { BaseSvg, SvgProps } from '@/components/icons/_base';
import React from 'react';

export const DropIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3l5 5a7 7 0 1 1 -10 0l5 -5" />
  </BaseSvg>
);
