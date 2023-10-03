import { ReactNode } from 'react';
import { IncidentImpact } from 'statuspage.io';
import { BsExclamationCircle, BsExclamationTriangle } from 'react-icons/bs';
import { Icon } from '@/ui/Icon';
import { getColor } from '@/features/status-bar/utils';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { PAGE_MAX_WIDTH } from '@/common/constants';

export function StatusBarBase({ content, impact }: { impact: IncidentImpact; content: ReactNode }) {
  if (impact === IncidentImpact.None) return null;
  const icon =
    impact === IncidentImpact.Critical ? (
      <Icon as={BsExclamationCircle} color={getColor(impact)} />
    ) : (
      <Icon as={BsExclamationTriangle} color={getColor(impact)} />
    );
  return (
    <Box
      width="100%"
      background="rgba(255, 255, 255, 0.8)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="20px 0"
    >
      <Flex
        width="100%"
        maxWidth={PAGE_MAX_WIDTH}
        padding="0 32px"
        alignItems="center"
        justifyContent="center"
        gap="20px"
      >
        {icon}
        {content}
      </Flex>
    </Box>
  );
}
