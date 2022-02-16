import { css } from '@emotion/react';
import { color } from '@stacks/ui';

const container = css`
  border-bottom: 1px solid var(--colors-border);
  &:last-child {
    border-bottom: none;
  }
`;

const common = css`
  display: block;
  content: '';
  position: absolute;
  background: ${color('accent')};
`;

export const bottomLineCss = css`
  ${container};
  &:after {
    ${common};
    bottom: 0;
    height: 3px;
    left: 50%;
    width: 0;
    transition: width 0.5s cubic-bezier(0.23, 1, 0.32, 1), left 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    &:hover {
      width: 100%;
      left: 0;
    }
  }
  &:hover:after {
    width: 100%;
    left: 0;
  }
`;

export const leftLineCss = css`
  ${container};
  &:after {
    ${common};
    left: -24px;
    width: 3px;
    top: 50%;
    height: 0;
    transition: height 0.5s cubic-bezier(0.23, 1, 0.32, 1), top 0.5s cubic-bezier(0.23, 1, 0.32, 1);
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
