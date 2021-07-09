import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { FiSlash } from 'react-icons/fi';

export const FailedIcon: React.FC<BoxProps> = props => <Box as={FiSlash} {...props} />;
