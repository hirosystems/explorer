import { Text } from '@/ui/Text';

import { TextLinkProps } from '../../../ui/TextLink';

export function SearchItemTitle(props: TextLinkProps) {
  return (
    <Text
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
    </Text>
  );
}
