import * as React from 'react';

import { TextLink, TextLinkProps } from '../../../ui/TextLink';

export function SearchLink(props: TextLinkProps) {
  return (
    <TextLink
      fontSize={'sm'}
      fontFamily="var(--font-instrument-sans)"
      color={'textPrimary'}
      textDecoration={'underline'}
      cursor={'pointer'}
      textOverflow={'ellipsis'}
      overflow={'hidden'}
      whiteSpace={'nowrap'}
      {...props}
    >
      {props.children}
    </TextLink>
  );
}
