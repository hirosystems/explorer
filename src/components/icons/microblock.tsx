import { Box, BoxProps } from '@/ui/components';
import React from 'react';
import { FiZap } from 'react-icons/fi';

export const MicroblockIcon: React.FC<BoxProps> = props => <Box as={FiZap} {...props} />;
