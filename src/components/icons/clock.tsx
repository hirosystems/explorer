import React from 'react';
import { FiClock } from 'react-icons/fi';
import { Box, BoxProps } from '@/ui/components';

export const ClockIcon: FC<BoxProps> = props => <Box as={FiClock} {...props} />;
