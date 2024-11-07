import { Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Block, INLINES, Inline, MARKS } from '@contentful/rich-text-types';
import { ReactNode } from 'react';
import { IncidentImpact } from 'statuspage.io';

import { getColor } from '../../app/_components/StatusBar/utils';
import { ListItem } from '../../ui/ListItem';
import { Text } from '../../ui/Text';
import { TextLink } from '../../ui/TextLink';
import { UnorderedList } from '../../ui/UnorderedList';

export const getRichTextRenderOptions =
  (impact: IncidentImpact = IncidentImpact.None) =>
  (): Options => {
    return {
      renderMark: {
        [MARKS.BOLD]: text => (
          <Text fontWeight="semibold" display={'inline'}>
            {text}
          </Text>
        ),
      },
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: ReactNode) => (
          <Text fontSize={'xs'}>{children}</Text>
        ),
        [BLOCKS.UL_LIST]: (node: Block | Inline, children: ReactNode) => (
          <UnorderedList fontSize={'xs'}>{children}</UnorderedList>
        ),
        [BLOCKS.LIST_ITEM]: (node: Block | Inline, children: ReactNode) => (
          <ListItem>{children}</ListItem>
        ),
        [INLINES.HYPERLINK]: ({ data }: Block | Inline, children: ReactNode) => (
          <TextLink
            display="inline"
            href={data.uri}
            target={'_blank'}
            rel={'noopener noreferrer'}
            textDecoration={'underline'}
            _hover={{ textDecoration: 'underline' }}
            color={getColor(impact)}
          >
            {children}
          </TextLink>
        ),
      },
    };
  };
