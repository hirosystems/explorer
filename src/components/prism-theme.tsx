import { css } from '@emotion/react';

export const prismTheme = css`
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
`;
