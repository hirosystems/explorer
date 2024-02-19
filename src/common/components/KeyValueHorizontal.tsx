import { useColorModeValue } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FC, ReactNode } from 'react';

import { Flex, FlexProps } from '../../ui/Flex';
import { Show } from '../../ui/Show';
import { CopyButton } from './CopyButton';

export interface KeyValueHorizontalProps {
  label: string | ReactNode;
  value: ReactNode;
  copyValue?: string;
  labelProps?: FlexProps;
}

const rowStyle = css`
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
  const borderColor = useColorModeValue('slate.150', 'slate.900');
  return (
    <Flex
      py={'16px'}
      alignItems={['flex-start', 'flex-start', 'center']}
      css={rowStyle}
      gap={'10px'}
      flexWrap="nowrap"
      minHeight={'73px'}
      borderBottom={'1px'}
      borderColor={borderColor}
      _last={{ borderBottom: 'unset' }}
      direction={['column', 'column', 'row']}
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
        <Show above="lg">
          <CopyButton
            className={'fancy-copy'}
            initialValue={copyValue}
            aria-label={'copy row'}
            size={'40px'}
          />
        </Show>
      )}
    </Flex>
  );
};
