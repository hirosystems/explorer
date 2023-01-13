import { Global, css } from '@emotion/react';
import * as React from 'react';

const TextAreaOverrides = (
  <Global
    styles={css`
      .clarity-editor-wrapper {
        position: absolute !important;
      }
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
          font-size: 14px !important;
        }

        textarea {
          width: 100% !important;
          padding-left: 76px !important;
          font-size: 14px !important;
          padding-top: 2px !important;
          font-family: 'Fira Code', monospace !important;
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

export const PrismTheme = (
  <Global
    styles={css`
      code[class*='language-'],
      pre[class*='language-'] {
        color: #c5c8c6 !important;
      }

      .token.comment,
      .token.prolog,
      .token.doctype,
      .token.cdata {
        color: #c5c8c6 !important;
        opacity: 0.85;
      }

      .token.punctuation {
        color: #c5c8c6 !important;
      }

      .namespace {
        opacity: 0.7;
      }

      .token.property,
      .token.keyword,
      .token.tag {
        color: #96cbfe !important;
      }

      .token.class-name {
        color: #ffffb6 !important;
        text-decoration: underline;
      }

      .token.boolean,
      .token.constant {
        color: #99cc99 !important;
      }

      .token.symbol,
      .token.deleted {
        color: #f92672 !important;
      }

      .token.number {
        color: #ff73fd !important;
      }

      .token.selector,
      .token.attr-name,
      .token.string,
      .token.char,
      .token.builtin,
      .token.inserted {
        color: #a8ff60 !important;
      }

      .token.variable {
        color: #c6c5fe !important;
      }

      .token.operator {
        color: #ededed !important;
      }

      .token.entity {
        color: #ffffb6 !important;
        cursor: help;
      }

      .token.url {
        color: #96cbfe !important;
      }

      .language-css .token.string,
      .style .token.string {
        color: #87c38a !important;
      }

      .token.atrule,
      .token.attr-value {
        color: #f9ee98 !important;
      }

      .token.function {
        color: #dad085 !important;
      }

      .token.regex {
        color: #e9c062 !important;
      }

      .token.important {
        color: #fd971f !important;
      }

      .token.important,
      .token.bold {
        font-weight: bold;
      }

      .token.italic {
        font-style: italic;
      }
    `}
  />
);

const globalStyles = css`
  html,
  body,
  #__next {
    height: 100%;
  }

  body.chakra-ui-light #stacks-explorer-wrapper {
    background-attachment: fixed;
    background-image: linear-gradient(transparent, transparent 530px, white 530px),
      linear-gradient(30deg, rgb(98, 135, 221), rgb(231, 72, 92) 58%, rgb(102, 137, 221) 100%);
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

  /* cyrillic-ext */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJV37MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
  }
  /* cyrillic */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVT7MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
  }
  /* greek-ext */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVz7MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+1F00-1FFF;
  }
  /* greek */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVP7MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+0370-03FF;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJV77MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113,
      U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7MOzlojwUKQ.woff)
      format('woff');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
      U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
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

  .skeleton-outer {
    display: flex;
    align-items: center;
  }

  .skeleton-outer-full-width {
    display: flex;
    width: 100%;
    align-items: center;
  }

  .skeleton-title {
    --base-color: rgba(255, 255, 255, 0.24);
    --highlight-color: rgba(255, 255, 255, 0.74);
  }

  .dark .react-loading-skeleton {
    --base-color: #1a1a1a;
  }

  .dark .react-loading-skeleton::after {
    --base-color: #1a1a1a;
    --highlight-color: #151515;
  }

  .dark .skeleton-title {
    --base-color: rgba(255, 255, 255, 0.24);
  }

  .dark.skeleton-title::after {
    --base-color: rgba(255, 255, 255, 0.24);
    --highlight-color: rgba(255, 255, 255, 0.74);
  }

  @keyframes react-loading-skeleton {
    100% {
      transform: translateX(100%);
    }
  }

  .ssr-skeleton {
    background-color: #d9d9d9;
    width: 100%;
    border-radius: 0.25rem;
    display: inline-flex;
    line-height: 1;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .ssr-skeleton:after {
    content: ' ';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background-repeat: no-repeat;
    background-image: linear-gradient(90deg, #d9d9d9, #f5f5f5, #d9d9d9);
    transform: translateX(-100%);
    animation-name: react-loading-skeleton;
    animation-direction: normal;
    animation-duration: 1.5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
`;

const GlobalStyles = <Global styles={globalStyles} />;

export { TextAreaOverrides, GlobalStyles };
