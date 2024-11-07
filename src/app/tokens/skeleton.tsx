'use client';

import { Group } from '@chakra-ui/react';

import { Section } from '../../common/components/Section';
import { Skeleton } from '../../components/ui/skeleton';
import { PageTitle } from '../_components/PageTitle';
import { TokensPageLayout } from './PageClient';
import { TokenTableSkeleton } from './TokensList/TokenTableSkeleton';

export default function TokensPageSkeleton() {
  return (
    <TokensPageLayout
      title={<PageTitle>Token Tracker</PageTitle>}
      tokensList={
        <Section
          title={'Tokens'}
          gridColumnStart={['1', '1', '2']}
          gridColumnEnd={['2', '2', '3']}
          minWidth={0}
          topRight={
            <Group
            // endElement={ // TODO: fix this
            //   <Icon color={`textCaption.${colorMode}`} pointerEvents="none">
            //     <MagnifyingGlass />
            //   </Icon>
            // }
            >
              <Skeleton width={'200px'} height={'40px'} />
            </Group>
          }
        >
          <TokenTableSkeleton />
        </Section>
      }
      disclaimer={null}
    />
  );
}
