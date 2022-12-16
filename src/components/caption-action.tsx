import React, { memo } from 'react';

import { Box, BoxProps, color } from '@stacks/ui';

import { Caption } from '@components/typography';

interface CaptionActionProps extends BoxProps {
  label: string;
  icon?: React.FC<any>;
}

export const CaptionAction: React.FC<CaptionActionProps> = memo(
  ({ label, icon: Icon, ...rest }) => {
    return (
      <Caption
        display="flex"
        alignItems="center"
        _hover={{ cursor: 'pointer', color: color('text-title') }}
        {...rest}
      >
        {Icon && (
          <Box as={Icon} mr="extra-tight" color="currentColor" size="16px" strokeWidth={1.5} />
        )}
        {label}
      </Caption>
    );
  }
);

CaptionAction.displayName = 'CaptionAction';
