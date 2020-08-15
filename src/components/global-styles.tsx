import * as React from 'react';

import { Global, css } from '@emotion/react';

import { ColorModes } from '@components/color-modes';
import { ProgressBarStyles } from '@components/progress-bar';
import { TextAreaOverrides } from '@components/code-editor/code-editor';

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

  @font-face {
    font-family: 'Open Sauce';
    src: url('/static/fonts/opensaucesans-medium-webfont.woff2') format('woff2'),
      url('/static/fonts/opensaucesans-medium-webfont.woff') format('woff');
    font-weight: 500;
    font-display: swap;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sauce';
    src: url('/static/fonts/opensaucesans-regular-webfont.woff2') format('woff2'),
      url('/static/fonts/opensaucesans-regular-webfont.woff') format('woff');
    font-weight: 400;
    font-weight: normal;
    font-style: normal;
  }
`;

const GlobalStyles = <Global styles={globalStyles} />;

export { TextAreaOverrides, GlobalStyles, ColorModes, ProgressBarStyles };
