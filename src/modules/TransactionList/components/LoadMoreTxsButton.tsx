import { border } from '@common/utils';
import { Caption } from '@components/typography';
import { Pending } from '@components/status';
import { FC, memo } from 'react';
import { Grid, color, Flex, Box } from '@stacks/ui';

interface LoadMoreTxsButton {
  isLoading: boolean;
  loadMore: () => void;
}

export const LoadMoreTxsButton: FC<LoadMoreTxsButton> = memo(({ isLoading, loadMore }) => (
  <Grid
    as="a"
    borderTop={border()}
    px="base"
    py="base"
    placeItems="center"
    _hover={{ color: color('text-title'), cursor: 'pointer' }}
    onClick={loadMore}
    color={color('text-caption')}
  >
    <Caption color="currentColor">
      {isLoading ? (
        <Flex alignItems="center">
          <Box size="16px" as={Pending} mr="extra-tight" />
          Loading...
        </Flex>
      ) : (
        `Load more transactions`
      )}
    </Caption>
  </Grid>
));
