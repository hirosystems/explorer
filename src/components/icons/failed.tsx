import { Box, BoxProps } from '@/ui/components';
import React from 'react';
import { FiSlash } from 'react-icons/fi';

export const FailedIcon: React.FC<BoxProps> = props => <Box as={FiSlash} {...props} />;
