import { Box, Flex, Stack } from '@chakra-ui/react';
import { ReactNode, Suspense, useMemo } from 'react';

import {
  SignersStackersData,
  useSuspenseSignerStackersInfinite,
} from '../../../app/signers/data/UseSignerAddresses';
import { CopyButton } from '../../../common/components/CopyButton';
import { ListFooter } from '../../../common/components/ListFooter';
import { Section } from '../../../common/components/Section';
import { Text } from '../../../ui/Text';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { AssociatedAddressesTableSkeleton } from './skeleton';

export const AssociatedAddressesTableLayout = ({
  addresses,
  footer,
}: {
  addresses: ReactNode;
  footer: ReactNode;
}) => {
  return (
    <Section title="Associated addresses">
      <Stack gap={0}>
        <Box h="auto" overflow="auto">
          {addresses}
        </Box>
        {footer}
      </Stack>
    </Section>
  );
};

export const AssociatedAddressListItemLayout = ({
  children,
  isLast,
}: {
  children: ReactNode;
  isLast: boolean;
}) => {
  return (
    <Flex
      alignItems={'center'}
      gap={1}
      py={6}
      borderBottom="1px solid var(--stacks-colors-borderSecondary)"
      _last={{
        borderBottom: 'none',
      }}
    >
      {children}
    </Flex>
  );
};

export const AssociatedAddressListItem = ({
  stacker,
  isLast,
}: {
  stacker: SignersStackersData;
  isLast: boolean;
}) => {
  return (
    <AssociatedAddressListItemLayout isLast={isLast}>
      <Text fontSize={'sm'}>{stacker.stacker_address}</Text>
      <CopyButton
        className={'fancy-copy'}
        initialValue={stacker.stacker_address}
        aria-label={'copy row'}
        color="textSubdued"
      />
    </AssociatedAddressListItemLayout>
  );
};

export const AssociatedAddressesTableBase = ({ signerKey }: { signerKey: string }) => {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const {
    data: signerStackers,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseSignerStackersInfinite(currentCycleId, signerKey);

  const stackers = useMemo(
    () => signerStackers?.pages.flatMap(page => page.results) ?? [],
    [signerStackers]
  );

  return (
    <AssociatedAddressesTableLayout
      addresses={signerStackers?.pages
        .flatMap(page => page.results)
        .map((stacker, i) => (
          <AssociatedAddressListItem
            key={stacker.stacker_address}
            stacker={stacker}
            isLast={i === stackers.length - 1}
          />
        ))}
      footer={
        <ListFooter
          label="addresses"
          isLoading={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          pb={6}
          position={'sticky'}
          bottom={0}
          bg="surface"
        />
      }
    />
  );
};

export const AssociatedAddressesTable = ({ signerKey }: { signerKey: string }) => {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Associated Addresses',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<AssociatedAddressesTableSkeleton />}>
        <AssociatedAddressesTableBase signerKey={signerKey} />
      </Suspense>
    </ExplorerErrorBoundary>
  );
};
