import { css } from '@emotion/react';

const container = (colorMode: string) => css`
  border-bottom: 1px solid var(--stacks-colors-border-${colorMode});
  position: relative;
  &:last-child {
    border-bottom: none;
  }
`;

const common = css`
  display: block;
  content: '';
  position: absolute;
  background: var(--stacks-colors-accent-light);
`;

export const bottomLineCss = (colorMode: string) => css`
  ${container(colorMode)};
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

export const leftLineCss = (colorMode: string) => css`
  ${container(colorMode)};
  &:after {
    ${common};
    left: -21px;
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
