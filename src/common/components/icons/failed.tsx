import React from 'react';
import { FiSlash } from 'react-icons/fi';

import { Box, BoxProps } from '../../../ui/Box';

export const FailedIcon: React.FC<BoxProps> = props => <Box as={FiSlash} {...props} />;
