import React from 'react';
import { FiSlash } from 'react-icons/fi';
import { Box, BoxProps } from '@/ui/components';

export const FailedIcon: FC<BoxProps> = props => <Box as={FiSlash} {...props} />;
