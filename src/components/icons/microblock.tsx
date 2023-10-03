import React from 'react';
import { FiZap } from 'react-icons/fi';
import { Box, BoxProps } from '@/ui/components';

export const MicroblockIcon: FC<BoxProps> = props => <Box as={FiZap} {...props} />;
