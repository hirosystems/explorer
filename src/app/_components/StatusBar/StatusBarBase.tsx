import React, { FC, ReactNode } from 'react';
import { BsExclamationCircle, BsExclamationTriangle } from 'react-icons/bs';
import { IncidentImpact } from 'statuspage.io';

import { PAGE_MAX_WIDTH } from '../../../common/constants/constants';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { getColor } from './utils';

export const StatusBarBase: FC<{ impact: IncidentImpact; content: ReactNode }> = ({
  content,
  impact,
}) => {
  const icon =
    impact === IncidentImpact.Critical ? (
      <Icon as={BsExclamationCircle} color={getColor(impact)} />
    ) : impact === IncidentImpact.None ? null : (
      <Icon as={BsExclamationTriangle} color={getColor(impact)} />
    );
  return (
    <Box
      position={'sticky'}
      width={'100%'}
      top={'0'}
      backdropFilter={'blur(10px)'}
      zIndex={'docked'}
    >
      <Box
        width={'100%'}
        background={'rgba(255, 255, 255, 0.8)'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        padding={'20px 0'}
      >
        <Flex
          width={'100%'}
          maxWidth={PAGE_MAX_WIDTH}
          padding={'0 32px'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'20px'}
        >
          {icon}
          {content}
        </Flex>
      </Box>
    </Box>
  );
};
