import { Box, Flex, FlexProps } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';

import { Text } from '../../ui/Text';
import { CopyButton } from './CopyButton';

export interface KeyValueVerticalProps extends FlexProps {
  label: ReactNode;
  value: ReactNode;
  copyValue?: string;
  className?: string;
}

const StyledFlexContainer = styled(Flex)`
  .fancy-copy {
    opacity: 0;
    position: relative;
    right: 10px;
    transition:
      opacity 0.4s ease-in-out,
      right 0.4s ease-in-out;
  }
  &:hover {
    .fancy-copy {
      opacity: 1;
      right: 0;
    }
  }
`;

export const KeyValueVertical: FC<KeyValueVerticalProps> = ({
  label,
  value,
  copyValue,
  className,
  ...rest
}) => {
  return (
    <StyledFlexContainer p={6} gap={2} flexDirection="column" {...rest} className={className}>
      <Text fontSize="sm" color="textSubdued">
        {label}
      </Text>
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Text fontSize="xs">{value}</Text>
        {copyValue && (
          <Box width={8}>
            <CopyButton className={'fancy-copy'} initialValue={copyValue} aria-label={'copy row'} />
          </Box>
        )}
      </Flex>
    </StyledFlexContainer>
  );
};
