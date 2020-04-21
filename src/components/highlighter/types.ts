import * as React from 'react';
export type Token = {
  types: string[];
  content: string;
  empty?: boolean;
};

export type StyleObj = {
  [key: string]: string | number | null;
};

export type TokenOutputProps = {
  key?: React.Key;
  style?: StyleObj;
  className: string;
  children: string;
  [otherProp: string]: any;
};

export type TokenInputProps = {
  key?: React.Key;
  style?: StyleObj;
  className?: string;
  token: Token;
  [otherProp: string]: any;
};

export type LineInputProps = {
  key?: React.Key;
  style?: StyleObj;
  className?: string;
  line: Token[];
  [otherProp: string]: any;
};

export type LineOutputProps = {
  key?: React.Key;
  style?: StyleObj;
  className: string;
  [otherProps: string]: any;
};

export type RenderProps = {
  tokens: Token[][];
  className: string;
  style: StyleObj;
  getLineProps: (input: LineInputProps) => LineOutputProps;
  getTokenProps: (input: TokenInputProps) => TokenOutputProps;
};

export type GetTokenProps = (input: TokenInputProps) => TokenOutputProps;
