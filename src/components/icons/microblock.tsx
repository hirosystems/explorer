import React from 'react';
import { FiZap } from 'react-icons/fi';

import { Box, BoxProps } from '@stacks/ui';

export const MicroblockIcon: React.FC<BoxProps> = props => <Box as={FiZap} {...props} />;
