import { css } from '@emotion/react';
import React from 'react';

import { Flex, FlexProps, color } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

const hoverStyle = css`
  .search-result-title {
    color: ${color('text-title')};
  }
  :hover {
    .search-result-title {
      color: ${color('accent')};
    }
  }
`;

export const ResultItemWrapper = forwardRefWithAs<FlexProps, 'a'>(
  ({ children, as = 'a', ...rest }, ref) => {
    return (
      <Flex css={hoverStyle}>
        <Flex
          as={as}
          p="loose"
          alignItems="center"
          position="relative"
          justifyContent="space-between"
          ref={ref}
          {...rest}
        >
          <Flex flexGrow={1} alignItems="center" justifyContent="space-between">
            {children}
          </Flex>
        </Flex>
      </Flex>
    );
  }
);
