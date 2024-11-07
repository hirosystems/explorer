import { Box, Flex, FlexProps } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';

import { CopyButton } from './CopyButton';

export interface KeyValueHorizontalProps {
  label: string | ReactNode;
  value: ReactNode;
  copyValue?: string;
  labelProps?: FlexProps;
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
export const KeyValueHorizontal: FC<KeyValueHorizontalProps> = ({
  label,
  value,
  copyValue,
  labelProps,
}) => {
  return (
    <StyledFlexContainer
      py={4}
      alignItems={['flex-start', 'flex-start', 'center']}
      gap={'10px'}
      flexWrap="nowrap"
      minHeight={18}
      borderBottom="1px solid var(--stacks-colors-border-secondary)"
      _last={{ borderBottom: 'unset' }}
      direction={['column', 'column', 'row']}
      className="kvh"
    >
      <Flex
        fontSize={'12px'}
        color={'textCaption'}
        width={['full', 'full', '140px']}
        flexShrink={0}
        {...labelProps}
      >
        {label}
      </Flex>
      <Flex
        flexDirection={['column', 'column', 'row']}
        alignItems={['flex-start', 'flex-start', 'center']}
        maxWidth="full"
        wordBreak={'break-all'}
        fontSize={'sm'}
      >
        {value}
      </Flex>
      {copyValue && (
        <Box hideBelow="lg">
          <CopyButton className={'fancy-copy'} initialValue={copyValue} aria-label={'copy row'} />
        </Box>
      )}
    </StyledFlexContainer>
  );
};
