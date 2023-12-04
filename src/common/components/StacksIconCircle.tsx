import { css } from '@emotion/react';
import * as React from 'react';

import { GridProps } from '../../ui/Grid';
import { Icon, IconProps } from '../../ui/Icon';
import { StxIcon } from '../../ui/icons';
import { Circle } from './Circle';

const iconStyle = css`
  position: relative;
  height: 18px;
  width: 18px;
  border-radius: 18px;
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }
`;
export function StacksIconCircle(props: GridProps) {
  return (
    <Circle size={18} bg="accent.light" css={iconStyle} {...props}>
      <Icon as={StxIcon} strokeWidth={2} size="11px" />
    </Circle>
  );
}
