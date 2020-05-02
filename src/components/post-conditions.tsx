import * as React from 'react';
import { Box, BoxProps, CodeBlock } from '@blockstack/ui';
import { SectionTitle } from '@components/typography';
import { Row } from '@components/rows/row';
import { PostCondition } from '@blockstack/stacks-blockchain-sidecar-types';

export const PostConditions = ({
  conditions,
  ...rest
}: { conditions: PostCondition[] } & BoxProps) =>
  conditions ? (
    <Box {...rest}>
      <SectionTitle mb="base-loose">Post conditions</SectionTitle>
      <Box>
        {conditions.map((condition: PostCondition) => {
          return (
            <Row>
              {condition.principal.type_id === 'principal_standard'
                ? condition.principal.address
                : null}{' '}
              {condition.condition_code}{' '}
              {condition.type === 'fungible' || condition.type === 'stx' ? condition.amount : null}{' '}
              {condition.type}
            </Row>
          );
        })}
      </Box>
    </Box>
  ) : null;
