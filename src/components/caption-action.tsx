import React from 'react';
import { Caption } from '@components/typography';
import { color, BoxProps } from '@stacks/ui';

interface CaptionActionProps extends BoxProps {
  label?: string;
  icon?: React.FC<any>;
}

export const CaptionAction: React.FC<CaptionActionProps> = ({ label, icon: Icon, ...rest }) => {
  return (
    <Caption
      display="flex"
      alignItems="center"
      _hover={{ cursor: 'pointer', color: color('text-title') }}
      {...rest}
    >
      {Icon && <Icon mr="extra-tight" color="currentColor" size="18px" strokeWidth={1.5} />}
      Filter transactions
    </Caption>
  );
};
