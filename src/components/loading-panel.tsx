import React from 'react';

import { Box, BoxProps, Flex, Grid, color } from '@stacks/ui';

import { border } from '@common/utils';

import { Pending } from '@components/status';
import { Text } from '@components/typography';

export const LoadingPanel: React.FC<{ text: string } & BoxProps> = React.memo(
  ({ text, ...rest }) => (
    <Box p="extra-loose" flexGrow={1} width="100%" {...rest}>
      <Flex flexDirection="column" alignItems="center">
        <Grid placeItems="center" borderRadius="100%" size="64px" border={border()} boxShadow="mid">
          <Pending opacity={0.5} size="32px" />
        </Grid>
        <Text mt="base" fontWeight="500" fontSize="14px" color={color('text-caption')}>
          {text}
        </Text>
      </Flex>
    </Box>
  )
);
