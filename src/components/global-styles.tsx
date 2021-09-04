import * as React from 'react';
import { Global, css } from '@emotion/react';
import { ProgressBarStyles } from '@components/progress-bar';
import { prismTheme } from '@components/prism-theme';

const TextAreaOverrides = (
  <Global
    styles={css`
      ${prismTheme};

      .code-editor {
        pre {
          width: fit-content;
          min-width: 100%;
          transform: translateY(2px);
        }

        input,
        textarea,
        [contenteditable] {
          caret-color: white;
        }

        & * {
          font-size: 18px !important;
        }

        textarea {
          width: 100% !important;
          padding-left: 76px !important;
          font-size: 18px !important;
          padding-top: 2px !important;
          font-family: 'Menlo', monospace !important;
          line-height: 24px !important;
          outline: transparent;
        }

        & > div {
          overflow: initial !important;
        }

        textarea,
        pre {
          white-space: pre !important;
          overflow-wrap: unset !important;
        }
      }
    `}
  />
);

const globalStyles = css`
  @import url('https://x.syvita.org/fonts/roobert/importme.css');
  @import url('https://x.syvita.org/fonts/inter/importme.css');
  connect-modal {
    .modal-container {
      z-index: 999999999;
      pointer-events: none;
    }

    .modal-body {
      pointer-events: all;
    }
  }

  html,
  body,
  #__next {
    height: 100%;
  }

  div[data-tippy-root] {
    z-index: 999999999999 !important;
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

export { TextAreaOverrides, GlobalStyles, ProgressBarStyles };
