import React from 'react';
import { FiZap } from 'react-icons/fi';

import { Box, BoxProps } from '../../../ui/Box';

export const MicroblockIcon: React.FC<BoxProps> = props => <Box as={FiZap} {...props} />;
