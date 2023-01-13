import { Box, BoxProps } from '@/ui/components';
import React from 'react';
import { FiClock } from 'react-icons/fi';

export const ClockIcon: React.FC<BoxProps> = props => <Box as={FiClock} {...props} />;
