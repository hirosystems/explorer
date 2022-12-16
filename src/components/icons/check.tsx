import React from 'react';
import { FiCheck } from 'react-icons/fi';

import { Box, BoxProps } from '@stacks/ui';

export const CheckIcon: React.FC<BoxProps> = props => <Box as={FiCheck} {...props} />;
