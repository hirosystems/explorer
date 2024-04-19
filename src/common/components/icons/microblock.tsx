import { Lightning } from '@phosphor-icons/react';
import React from 'react';

import { Box, BoxProps } from '../../../ui/Box';

export const MicroblockIcon: React.FC<BoxProps> = props => <Box as={Lightning} {...props} />;
