import React from 'react';
import { FiClock } from 'react-icons/fi';

import { Box, BoxProps } from '../../../ui/Box';

export const ClockIcon: React.FC<BoxProps> = props => <Box as={FiClock} {...props} />;
