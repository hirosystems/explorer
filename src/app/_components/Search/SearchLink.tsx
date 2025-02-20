import * as React from 'react';
import { useEffect, useRef } from 'react';

import { useAppDispatch } from '../../../common/state/hooks';
import { setQuickNavUrl } from '../../../features/search/search-slice';
import { TextLink, TextLinkProps } from '../../../ui/TextLink';

export function SearchLink(props: TextLinkProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setQuickNavUrl(props.href || ''));
    return () => {
      dispatch(setQuickNavUrl(''));
    };
  }, [dispatch, props.href]);

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
