'use client';

import { css } from '@emotion/react';

const container = () => css`
  position: relative;
`;

const common = css`
  display: block;
  content: '';
  position: absolute;
  background: var(--stacks-colors-brand);
`;

export const leftLineCss = () => css`
  ${container()};
  &:after {
    ${common};
    left: calc(var(--stacks-space-6) * -1);
    width: 3px;
    top: 50%;
    height: 0;
    transition:
      height 0.5s cubic-bezier(0.23, 1, 0.32, 1),
      top 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    &:hover {
      height: 100%;
      top: 0;
    }
  }
  &:hover:after {
    height: 100%;
    top: 0;
  }
`;
