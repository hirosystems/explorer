import * as React from 'react';
import { TextAreaOverrides } from '@components/code-editor/code-editor';
import { ProgressBarStyles } from '@components/progress-bar';
import { ColorModes } from '@components/color-modes';
import { css, Global } from '@emotion/react';
const globalStyles = css`
  html,
  body,
  #__next {
    height: 100%;
  }
  .prism-code *::selection {
    background-color: #aab3ff;
    color: white !important;
  }

  .portal {
    position: relative;
    z-index: 99;
  }
  a {
    text-decoration: none;
  }
`;

const GlobalStyles = <Global styles={globalStyles} />;

export { TextAreaOverrides, GlobalStyles, ColorModes, ProgressBarStyles };
