'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { Section } from '../../common/components/Section';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { InputGroup } from '../../ui/InputGroup';
import { SkeletonItem } from '../../ui/SkeletonItem';
import { PageTitle } from '../_components/PageTitle';
import { TokenTableSkeleton } from './TokensList/TokenTableSkeleton';

export default function Skeleton() {
  const colorMode = useColorMode().colorMode;
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>
        <SkeletonItem width={'400px'} height={'43px'} />
      </PageTitle>
      <Section
        title={'Tokens'}
        gridColumnStart={['1', '1', '2']}
        gridColumnEnd={['2', '2', '3']}
        minWidth={0}
        topRight={
          <InputGroup
            endElement={
              <Icon as={MagnifyingGlass} color={`textCaption.${colorMode}`} pointerEvents="none" />
            }
          >
            <SkeletonItem width={'200px'} height={'40px'} />
          </InputGroup>
        }
      >
        <TokenTableSkeleton />
      </Section>
    </Flex>
  );
}
