import React from 'react';
import { FiSlash } from 'react-icons/fi';

import { Box, BoxProps } from '@stacks/ui';

export const FailedIcon: React.FC<BoxProps> = props => <Box as={FiSlash} {...props} />;
